import { useEffect } from 'react';
import { ApiState } from 'state/api';
import useRequest from './useRequest';

export default <T>(url: string): ApiState<T> => {
  const { state, request } = useRequest<T>({ url, method: 'GET' });
  useEffect(() => request({}), [url]);
  return state;
};
