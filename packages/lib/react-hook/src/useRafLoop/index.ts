import * as React from 'react';

export type RafLoopReturns = [() => void, () => void, () => boolean];

export const useRafLoop = (
    callback: FrameRequestCallback,
    initiallyActive = true,
): RafLoopReturns=> {
  const raf = React.useRef<number | null>(null);
  const rafActivity = React.useRef<boolean>(false);
  const rafCallback = React.useRef(callback);
  rafCallback.current = callback;

  const step = React.useCallback((time: number) => {
    if (rafActivity.current) {
      rafCallback.current(time);
      raf.current = requestAnimationFrame(step);
    }
  }, []);

  const result = React.useMemo(
      () =>
            [
              () => {
                // stop
                if (rafActivity.current) {
                  rafActivity.current = false;
                  raf.current && cancelAnimationFrame(raf.current);
                }
              },
              () => {
                // start
                if (!rafActivity.current) {
                  rafActivity.current = true;
                  raf.current = requestAnimationFrame(step);
                }
              },
              (): boolean => rafActivity.current, // isActive

            ] as RafLoopReturns,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
  );

  React.useEffect(() => {
    if (initiallyActive) {
      result[1]();
    }

    return result[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return result;
};
