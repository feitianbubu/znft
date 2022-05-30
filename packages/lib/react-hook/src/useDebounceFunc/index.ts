import * as React from 'react';
import {useTimeoutFn} from '../useTimeoutFn';

export type UseDebounceFuncReturn<P> = [((params: P) =>( void | Promise<void> ))|(() => (void | Promise<void>) )];

// eslint-disable-next-line require-jsdoc
export function useDebounceFunc<P>(
    fn: ((params:P)=>(void|Promise<void>))|(()=>(void|Promise<void>)),
    ms: number = 0,
): UseDebounceFuncReturn<P> {
  const funcRef = React.useRef(fn);
  React.useEffect(()=>{
    funcRef.current = fn;
  }, [fn]);
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  const f:typeof fn= React.useCallback((e)=>{
    if (isReady()==false) {
      reset(e);
    } else if (isReady()==true) {
      cancel();
      reset(e);
    } else {
      reset(e);
    }
    // 只生成第一次
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [f];
}

