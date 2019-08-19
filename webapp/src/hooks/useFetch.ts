import { useEffect } from 'react';
import { ApiCallbacks, ApiState } from 'state/api';
import useRequest from './useRequest';

/**
 * Convenience method for calling useRequest with just a URL and method: GET.
 */
const useFetch = <T>(url: string, callbacks?: ApiCallbacks<T>): ApiState<T> => {
  const { state, request } = useRequest<T>({ url, method: 'GET' }, callbacks);
  useEffect(() => request(), [url, request]);
  return state;
};

export default useFetch;
