import * as React from 'react';
import {Slide, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import {LoadingButton} from '@mui/lab';
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
export const Modal: React.FC<PropsWithChildren<ModalProps>> = (props) => {
  const {
    onOk,
    onCancel,
    title = '',
    children,
    okText = '确定',
    cancelText = '取消',
    childrenType,
    loading = false,
    ...others
  } = props;
  const memo = useMemo(() => {
    if (typeof children == 'string' || childrenType == 'string') {
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
      <LoadingButton
        size="small"
        onClick={onCancel}
        loading={loading}
        variant="contained"
      >
        {cancelText}
      </LoadingButton>
      <LoadingButton
        size="small"
        onClick={onOk}
        loading={loading}
        variant="contained"
      >
        {okText}
      </LoadingButton>
    </DialogActions>
  </Dialog>;
};
export default Modal;
