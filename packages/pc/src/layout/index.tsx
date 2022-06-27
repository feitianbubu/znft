import React, {PropsWithChildren, useCallback, useState} from "react";
import Provider from "@/pc/instance/provider";
import {useMount} from "@lib/react-hook";
import {message} from "@lib/util";
import Nav from "@/pc/components/nav";
import Footer from "@/pc/components/footer";
export const Layout:React.FC<PropsWithChildren<unknown>> = (props)=>{
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
        <Nav/>
        {props.children}
        <Footer/>
    </>
}
export default Layout
