import {JSXElementConstructor, ReactElement} from 'react';
import * as React from 'react';

export interface DropdownProps{
  children:ReactElement<any, string | JSXElementConstructor<any>>
  /**
   * 必须是menu全家桶
   */
  overlay:React.ReactElement
  /**
   * 显示菜单之前的aop
   */
  preShow?:()=>(Promise<boolean>|boolean)
  onClick?:(event:React.MouseEvent<HTMLDivElement, MouseEvent>, key?:React.Key|null)=>void;
}
