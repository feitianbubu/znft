import * as React from 'react';
import {useEffectOnce} from '../useEffectOnce';

export const useUnmount = (fn: () => any): void => {
  const fnRef = React.useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
};


