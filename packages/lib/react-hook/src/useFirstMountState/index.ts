import * as React from 'react';

export const useFirstMountState:()=>boolean = ()=> {
  const isFirst = React.useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};

