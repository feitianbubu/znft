import React, {PropsWithChildren} from "react";
import WalletProvider from "@/pc/context/wallet";
export const Context:React.FC<PropsWithChildren<unknown>> = (props)=>{
    const {children} = props;
    return <WalletProvider>
        {children}
    </WalletProvider>
}
export  default  Context;
