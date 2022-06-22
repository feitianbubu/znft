import React, {PropsWithChildren, useCallback} from "react";
import {SnackbarKey, SnackbarProvider} from 'notistack';
import {Button} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Provider :React.FC<PropsWithChildren<unknown>> = (props)=>{
    const {children} = props;
    const notistackRef = React.useRef<SnackbarProvider>(null);
    const onClickDismiss = useCallback((key: SnackbarKey)=>{
        notistackRef?.current?.closeSnackbar(key);
    },[])
    const action = useCallback((key:SnackbarKey)=>{
        const close = ()=>{
            onClickDismiss(key)
        }
        return  <Button onClick={close} endIcon={<CloseIcon/>}/>
    },[onClickDismiss])
    return <SnackbarProvider maxSnack={3} ref={notistackRef} action={action}>{children}</SnackbarProvider>
}
export  default  Provider;
