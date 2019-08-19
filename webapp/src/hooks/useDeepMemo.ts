import { useRef } from 'react';
import { isEqual } from 'lodash';

/**
 * Hook to memoize a value, and only change it when its deep-equal value changes.
 */
const useDeepMemo = <T>(value: T): T => {
  const ref = useRef(value);
  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
};

export default useDeepMemo;
