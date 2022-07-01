import React, {useCallback, useState} from "react";
import {Toolbar, Drawer} from "@mui/material";
import Login from "./login";
import {useDrawerState} from "@/pc/components/nav/components/drawer/context";
import {useWallet} from "@/pc/context/wallet";
import Logged from "./logged";

const sx = {
    width: 480,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: { width: 480, boxSizing: 'border-box' },
}
const Action:React.FC = ()=>{
    const [state,setState] = useDrawerState();
    const {visible} = state;
    const [wallet] = useWallet();
    const {isConnected} = wallet;
    const handleClose = useCallback(()=>{
        setState({visible:false})
    },[setState])
    return <Drawer
    anchor={'right'}
    open={visible}
    onClose={handleClose}
    sx={sx}
    >
        <Toolbar />
        {isConnected?<Logged/>:<Login/>}
        </Drawer>

}
export  default  Action;
