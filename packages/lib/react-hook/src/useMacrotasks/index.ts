import * as React from 'react';

export const useMacrotasks = (fn:Function)=>{
  const func:()=>void = React.useCallback(()=>{
    setTimeout(()=>{
      fn();
    }, 0);
  }, [fn]);
  return func;
};


