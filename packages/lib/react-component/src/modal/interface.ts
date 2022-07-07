import {DialogProps} from '@mui/material/Dialog/Dialog';

export interface ModalProps extends DialogProps{
    onOk?:()=>void
    onCancel?:()=>void
    okText?:string
    cancelText?:string
    title?:string,
    childrenType?:'string'|'node'
    loading?:boolean
}
