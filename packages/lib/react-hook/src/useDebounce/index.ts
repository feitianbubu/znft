
import * as React from 'react';
import {useTimeoutFn} from '../useTimeoutFn';

export type UseDebounceReturn = [() => boolean | null, () => void];

export const useDebounce = (
    fn: <P>(params:P)=>void|Promise<void>,
    ms: number = 0,
    deps: React.DependencyList = [],
): UseDebounceReturn => {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(reset, deps);

  return [isReady, cancel];
};
