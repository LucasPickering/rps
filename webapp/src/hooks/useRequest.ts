import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useMemo, useReducer } from 'react';
import { ApiState, ApiError } from 'state/api';
import useDeepMemo from './useDeepMemo';
import useIsMounted from './useIsMounted';
import camelcaseKeys from 'camelcase-keys';

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
 */
const useRequest = <T, E = {}>(
  config: AxiosRequestConfig
): {
  state: ApiState<T, E>;
  request: (subConfig?: AxiosRequestConfig) => Promise<T>;
} => {
  const [state, dispatch] = useReducer<
    React.Reducer<ApiState<T, E>, ApiAction<T, E>>
  >(apiReducer, defaultApiState);

  // Prevent updates after unmounting
  const isMounted = useIsMounted();

  // Everything here is memoized to prevent unnecessary re-renders and
  // effect triggers

  const configMemo = useDeepMemo(config);

  const request = useCallback(
    (subConfig?: AxiosRequestConfig) => {
      dispatch({ type: ApiActionType.Request });
      return new Promise<T>((resolve, reject) => {
        axios
          .request({ ...configMemo, ...subConfig })
          .then(response => {
            const camelData =
              response.data &&
              ((camelcaseKeys(response.data, {
                deep: true,
              }) as unknown) as T);
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
