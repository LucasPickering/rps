import axios from 'axios';
import { useCallback, useMemo, useReducer } from 'react';
import { ApiState, ApiError, RequestConfig } from 'state/api';
import useDeepMemo from './useDeepMemo';
import useIsMounted from './useIsMounted';
import { camelCaseKeys, snakeCaseKeys } from 'util/funcs';

enum ApiActionType {
  Request,
  Success,
  Error,
}

type ApiAction<T, E> =
  | { type: ApiActionType.Request }
  | { type: ApiActionType.Success; data: T }
  | { type: ApiActionType.Error; error: ApiError<E> };

const apiReducer = <T, E>(
  state: ApiState<T, E>,
  action: ApiAction<T, E>
): ApiState<T, E> => {
  switch (action.type) {
    case ApiActionType.Request:
      return {
        ...state,
        loading: true,
        data: undefined,
        error: undefined,
      };
    case ApiActionType.Success:
      return {
        ...state,
        loading: false,
        data: action.data,
        error: undefined,
      };
    case ApiActionType.Error:
      return {
        ...state,
        loading: false,
        data: undefined,
        error: action.error,
      };
  }
};

const defaultApiState = {
  loading: false,
};

/**
 * Hook to get/post data from/to the server for the given resource/status.
 * Returns a `state` object with loading/data/error, and a `request` function
 * that, when called, initiates a request. `request` returns a `Promise` that
 * resolves to data and rejects with an error. `Promise` doesn't let us type
 * the error, but it will always be an {@link ApiError};
 *
 * @typeparam R the type of the response data
 * @typeparam E the type of the response error
 * @typeparam P the type of the query params object
 * @typeparam D the type of POST data
 */
const useRequest = <R, E = {}, P = undefined, D = undefined>(
  config: RequestConfig<P, D>
): {
  state: ApiState<R, E>;
  request: (subConfig?: RequestConfig<P, D>) => Promise<R>;
} => {
  const [state, dispatch] = useReducer<
    React.Reducer<ApiState<R, E>, ApiAction<R, E>>
  >(apiReducer, defaultApiState);

  // Prevent updates after unmounting
  const isMounted = useIsMounted();

  // Everything here is memoized to prevent unnecessary re-renders and
  // effect triggers

  const configMemo = useDeepMemo(config);

  const request = useCallback(
    (subConfig?: RequestConfig<P, D>) => {
      dispatch({ type: ApiActionType.Request });
      // Convert keys to snake case so the API can handle them
      const data = subConfig && subConfig.data && snakeCaseKeys(subConfig.data);
      return new Promise<R>((resolve, reject) => {
        axios
          .request({ ...configMemo, ...subConfig, data })
          .then(response => {
            const camelData =
              response.data && ((camelCaseKeys(response.data) as unknown) as R);
            if (isMounted.current) {
              dispatch({ type: ApiActionType.Success, data: camelData });
              resolve(camelData);
            }
          })
          .catch(errorContainer => {
            const error = errorContainer.response;
            if (isMounted.current) {
              dispatch({ type: ApiActionType.Error, error });
              reject(error);
            }
          });
      });
    },
    [configMemo, dispatch, isMounted]
  );

  return useMemo(
    () => ({
      state,
      request,
    }),
    [state, request]
  );
};

export default useRequest;
