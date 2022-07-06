import * as React from 'react';
import {Slide, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import {TransitionProps} from '@mui/material/transitions';
import {ModalProps} from './interface';
import {PropsWithChildren, useMemo} from 'react';
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export const Modal:React.FC<PropsWithChildren<ModalProps>> = (props)=>{
  const {onOk, onCancel, title='', children, okText='确定', cancelText='取消', childrenType, ...others} = props;
  const memo = useMemo(()=>{
    if (typeof children=='string'||childrenType=='string') {
      return <DialogContentText>
        {children}
      </DialogContentText>;
    } else {
      return <>{children}</>;
    }
  }, [children, childrenType]);
  return <Dialog
    {...others}
    TransitionComponent={Transition}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {memo}
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>{cancelText}</Button>
      <Button onClick={onOk}>{okText}</Button>
    </DialogActions>
  </Dialog>;
};
export default Modal;
