import React, {PropsWithChildren} from "react";
import WalletProvider from "@/pc/context/wallet";
import SnackProvider from "@/pc/context/snack";
export const Context:React.FC<PropsWithChildren<unknown>> = (props)=>{
    const {children} = props;
    return <WalletProvider>
        <SnackProvider>
        {children}
        </SnackProvider>
    </WalletProvider>
}
export  default  Context;
