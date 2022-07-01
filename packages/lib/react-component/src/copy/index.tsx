import * as React from 'react';
import {Box, Tooltip} from '@mui/material';
import {useCallback, useMemo, useState} from 'react';
import {copy} from '@lib/util';
import {CopyProps} from './interface';
export const Copy:React.FC<CopyProps> = (props)=>{
  const {text, placeholder, arrow, onClick, successText='复制成功', errorText='复制失败', children, ...others} = props;
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const handleClick = useCallback(async (event:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    if (onClick) {
      onClick(event);
    }
    if (!text) {
      return;
    }
    try {
      const res = await copy(text);
      if (res) {
        setTitle(successText);
      } else {
        setTitle(errorText);
      }
    } catch (e) {
      setTitle(errorText);
    }
    setVisible(true);
  }, [errorText, onClick, successText, text]);
  const handleClose = useCallback(()=>{
    setVisible(false);
  }, []);
  const memoChildren = useMemo(()=>{
    return children;
  }, [children]);
  return <Tooltip open={visible} onClose={handleClose} placeholder={placeholder} arrow={arrow} title={title}>
    <Box {...others} onClick={handleClick}>{memoChildren}</Box>
  </Tooltip>;
};
export default Copy;
