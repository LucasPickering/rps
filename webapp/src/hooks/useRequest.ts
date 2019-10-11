import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';
import { useCallback, useMemo, useReducer, useRef, useEffect } from 'react';
import { ApiState, ApiError, RequestConfig } from 'state/api';
import useDeepMemo from './useDeepMemo';
import camelcaseKeys from 'camelcase-keys';
import snakeCaseKeys from 'snakecase-keys';
import { Dictionary } from 'lodash';

// axios setup to cooperate with Django's CSRF policy
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

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
  baseRequestConfig: RequestConfig<P, D>
): {
  state: ApiState<R, E>;
  request: (requestConfig?: RequestConfig<P, D>) => Promise<R>;
} => {
  const [state, dispatch] = useReducer<
    React.Reducer<ApiState<R, E>, ApiAction<R, E>>
  >(apiReducer, defaultApiState);

  const cancelTokenSource = useRef<CancelTokenSource>(
    axios.CancelToken.source()
  );
  // Auto-cancel requests on unmount
  useEffect(() => () => cancelTokenSource.current.cancel(), []);

  // This is memoized to prevent unnecessary effect triggers
  const baseRequestConfigMemo = useDeepMemo(baseRequestConfig);

  const request = useCallback(
    (requestConfig?: RequestConfig<P, D>) => {
      // Cancel any existing request and start a new one
      cancelTokenSource.current.cancel();
      cancelTokenSource.current = axios.CancelToken.source();

      const fullRequestConfig: AxiosRequestConfig = {
        cancelToken: cancelTokenSource.current.token,
        ...baseRequestConfigMemo,
        ...requestConfig,
      };
      // Convert keys to snake case so the API can handle them
      fullRequestConfig.data =
        fullRequestConfig.data &&
        snakeCaseKeys((fullRequestConfig.data as unknown) as Dictionary<
          unknown
        >);

      dispatch({ type: ApiActionType.Request });
      return axios
        .request(fullRequestConfig)
        .then(response => {
          const camelData =
            response.data &&
            ((camelcaseKeys(response.data, { deep: true }) as unknown) as R);

          dispatch({ type: ApiActionType.Success, data: camelData });
          return camelData;
        })
        .catch(error => {
          const errorData = error.response;
          if (!axios.isCancel(error)) {
            dispatch({ type: ApiActionType.Error, error: errorData });
          }
          throw error; // Caller will have to handle this
        });
    },
    [baseRequestConfigMemo, dispatch]
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
