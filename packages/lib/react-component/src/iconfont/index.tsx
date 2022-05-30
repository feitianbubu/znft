import * as React from 'react';
import {IconfontProps} from './interface';
/**
 *
 * @param props
 * @constructor
 * icon 不受react控制，更改name不会引起重新渲染
 */
export const Iconfont:React.FC<IconfontProps>=(props)=>{
  return <svg className="icon" aria-hidden="true">
    <use xlinkHref={`#${props.name}`}></use>
  </svg>;
};

export default Iconfont;
