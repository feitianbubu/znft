import * as React from 'react';

export const useLoading:<P, R>(fetch:(params?:P)=>Promise<R>)=>[(params?:P)=>Promise<R>, boolean]= (fetch) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const func = React.useCallback(async (params?:Parameters<typeof fetch>[0]) => {
    setLoading(true);
    const res = await fetch(params);
    setLoading(false);
    return res;
  }, [fetch]);
  return [func, loading];
};


