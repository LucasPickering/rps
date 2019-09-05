import { useEffect } from 'react';
import { ApiState, RequestConfig } from 'state/api';
import useRequest from './useRequest';

/**
 * Fetches from a URL with a GET request.
 */
const useFetch = <R, E = {}, P = undefined>(
  url: string,
  config?: RequestConfig<P, undefined>
): ApiState<R, E> => {
  const { state, request } = useRequest<R, E, P>({
    ...config,
    url,
    method: 'GET',
  });
  useEffect(() => {
    request();
  }, [url, request]);
  return state;
};

export default useFetch;
