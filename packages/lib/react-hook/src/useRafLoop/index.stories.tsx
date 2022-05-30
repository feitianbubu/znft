
import * as React from 'react';
import {useRafLoop} from '../useRafLoop';
import {ComponentMeta, ComponentStory} from '@storybook/react';

const componentMeta:ComponentMeta<any> = {
  title: 'Hooks/common/useRafLoop',
  parameters: {
    docs: {
      description: {
        component: '截流',
      },
    },
  },
};
export default componentMeta;

export const Demo:ComponentStory<any> = (props)=>{
  console.log('useRafLoop', props);
  const [ticks, setTicks] = React.useState(0);
  const [lastCall, setLastCall] = React.useState(0);
  const [loopStop, loopStart, isActive] = useRafLoop((time) => {
    setTicks((ticks) => ticks + 1);
    setLastCall(time);
  });
  return (
    <div>
      <div>RAF triggered: {ticks} (times)</div>
      <div>Last high res timestamp: {lastCall}</div>
      <br />
      <button onClick={() => {
isActive() ? loopStop() : loopStart();
      }}>{isActive() ? 'STOP' : 'START'}</button>
    </div>
  );
};
