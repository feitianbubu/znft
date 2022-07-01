import React, {useCallback, useState} from "react";
import {Button, Drawer, IconButton, Menu, MenuItem} from "@mui/material";
import {useDrawerState} from "@/pc/components/nav/components/drawer/context";
import {Dropdown} from "@lib/react-component/lib/dropdown";
import {AccountBalanceWalletOutlined, AccountCircleOutlined} from "@mui/icons-material";
import Action from "./action";
import {useWallet} from "@/pc/context/wallet";

// https://api.wallet.coinbase.com/rpc/v2/desktop/chrome
// https://metamask.io/download.html
const overlay = <Menu open={false}
>
    <MenuItem key={1}>Profile</MenuItem>
    <MenuItem key={2}>My account</MenuItem>
    <MenuItem key={3}>Logout</MenuItem>
</Menu>
const Panel:React.FC = ()=>{
    const [,setState] = useDrawerState();
    const [wallet ] = useWallet()
    const {isConnected} = wallet;
    const handlePreShow=  useCallback(()=>{
        if(!isConnected){
            setState({visible:true})
            return false
        }else {
            return true
        }

    },[isConnected,setState])
    const handleOpen = useCallback(()=>{
        setState({visible:true})
    },[setState])
    return <>
        <Action/>
        <Dropdown
            preShow={handlePreShow}
            overlay={overlay}>
            <IconButton>
                <AccountCircleOutlined/>
            </IconButton>
        </Dropdown>
        <IconButton onClick={handleOpen}>
            <AccountBalanceWalletOutlined/>
        </IconButton>
    </>

}
export  default  Panel;
