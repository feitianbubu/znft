import * as React from 'react';
import {Box} from '@mui/material';
import {RoundProps} from './interface';
import {useMemo} from 'react';
const COLOR_MAP:{[key:string]:string} = {
  error: 'rgb(239, 83, 80)',
  waring: 'rgb(255, 152, 0)',
  info: 'rgb(3, 169, 244)',
  success: 'rgb(76, 175, 80)',
};
export const Round:React.FC<RoundProps> = (props)=>{
  const {size=5, color='#888888'} =props;
  const _color = useMemo(()=>{
    return COLOR_MAP[color]||color;
  }, [color]);
  return <Box {...props} bgcolor={_color} width={size} height={size} borderRadius={size}/>;
};
export default Round;
