import { useEffect } from 'react';

const useDebugEffect = (title: string, deps?: unknown[]): void => {
  const depsString = JSON.stringify(deps);
  useEffect(() => {
    console.log(`${title} ${depsString} update`);
    return () => {
      console.log(`${title} ${depsString} cleanup`);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDebugEffect;
