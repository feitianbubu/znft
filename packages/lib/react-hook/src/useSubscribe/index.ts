import * as React from 'react';

/**
 * 语义化
 */
export const useSubscribe = (effect: React.EffectCallback, sub:React.DependencyList, deps: React.DependencyList)=>{
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(effect, [...sub, ...deps]);
};
