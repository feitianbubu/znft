import * as React from 'react';
import {createIcon} from '@lib/util';
import {InternalIconProps} from './interface';

export const InternalIcon :React.FC<InternalIconProps>=(props)=>{
  return <div style={{fontSize: props.size||8}} dangerouslySetInnerHTML={{__html: createIcon(props.type)}}/>;
};

export default InternalIcon;
