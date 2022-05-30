import React, {PropsWithChildren, useCallback, useState} from "react";
import Provider from "@/pc/instance/provider";
import {useMount} from "@lib/react-hook";
import {message} from "@lib/util";
export const Layout:React.FC<PropsWithChildren<unknown>> = (props)=>{
    const [open, setOpen] = useState(false);
    const verifyProvider = useCallback(async ()=>{
        const provider = await Provider.getInstance();
        if(provider){
            return provider
        }else{
            message.error("请安装谷歌metamask插件")
        }
    },[])
    const init = useCallback(async ()=>{
        await verifyProvider();
    },[ verifyProvider])
    useMount(()=>{
        init().then()
    })
    return <>
        {props.children}
    </>
}
export default Layout
