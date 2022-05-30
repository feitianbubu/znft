import * as React from 'react';
import {useInterval} from '@lib/react-hook';
import {CountDownProps} from './interface';
const {useState} = React;

export const CountDown: React.FC<CountDownProps> = (props) => {
  const [time, setTime] = useState(props.defaultDelay||60);
  const [delay, setDelay] = useState<number | null>(1000);
  useInterval(() => {
    // Your custom logic here
    if (time > 0) {
      setTime(time - 1);
    } else {
      setDelay(null);
      props.onFinish?.();
    }
  }, delay);

  return <>{time}</>;
};

export default CountDown;
