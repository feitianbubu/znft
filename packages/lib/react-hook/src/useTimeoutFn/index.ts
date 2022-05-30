import * as React from 'react';

export type UseTimeoutFnReturn = [() => boolean | null, () => void, (e?:any) => void];

export const useTimeoutFn:<P>(fn: (params:P)=>void|Promise<void>, ms: number)=> UseTimeoutFnReturn = (fn, ms) =>{
  const _ms = ms|0;
  const ready = React.useRef<boolean | null>(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const callback = React.useRef(fn);

  const isReady = React.useCallback(() => ready.current, []);

  const set:typeof fn= React.useCallback((e) => {
    ready.current = false;
    timeout.current && clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current(e);
    }, _ms);
  }, [_ms]);

  const clear = React.useCallback(() => {
    ready.current = null;
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // update ref when function changes
  React.useEffect(() => {
    callback.current = fn;
  }, [fn]);

  // set on mount, clear on unmount
  React.useEffect(() => {
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_ms]);

  return [isReady, clear, set];
};

