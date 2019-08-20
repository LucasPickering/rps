import { useEffect } from 'react';
import { ApiState } from 'state/api';
import useRequest from './useRequest';

/**
 * Fetches from a URL with a GET request.
 */
const useFetch = <T>(url: string): ApiState<T> => {
  const { state, request } = useRequest<T>({ url, method: 'GET' });
  useEffect(() => {
    request();
  }, [url, request]);
  return state;
};

export default useFetch;
