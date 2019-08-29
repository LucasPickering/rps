import { useEffect } from 'react';
import { ApiState } from 'state/api';
import useRequest from './useRequest';

/**
 * Fetches from a URL with a GET request.
 */
const useFetch = <T, E = {}>(url: string): ApiState<T, E> => {
  const { state, request } = useRequest<T, E>({ url, method: 'GET' });
  useEffect(() => {
    request();
  }, [url, request]);
  return state;
};

export default useFetch;
