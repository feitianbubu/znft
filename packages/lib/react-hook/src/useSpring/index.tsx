import * as React from 'react';
import {Spring, SpringSystem} from 'rebound';
export const useSpring = (targetValue: number = 0, tension: number = 50, friction: number = 3) => {
  const [spring, setSpring] = React.useState<Spring | null>(null);
  const [value, setValue] = React.useState<number>(targetValue);

  // memoize listener to being able to unsubscribe later properly, otherwise
  // listener fn will be different on each re-render and wouldn't unsubscribe properly.
  const listener = React.useMemo(() => ({
    onSpringUpdate: (currentSpring:Spring) => {
      const newValue = currentSpring.getCurrentValue();
      setValue(newValue);
    },
  }), [],
  );

  React.useEffect(() => {
    if (!spring) {
      const newSpring = new SpringSystem().createSpring(tension, friction);
      newSpring.setCurrentValue(targetValue);
      setSpring(newSpring);
      newSpring.addListener(listener);
    }

    return () => {
      if (spring) {
        spring.removeListener(listener);
        setSpring(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tension, friction, spring]);

  React.useEffect(() => {
    if (spring) {
      spring.setEndValue(targetValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue]);

  return value;
};

