import * as React from 'react';

export const usePrevious:<T>(state: T)=> T | undefined=(state)=> {
  const ref = React.useRef<typeof state>();

  React.useEffect(() => {
    ref.current = state;
  });

  return ref.current;
};
