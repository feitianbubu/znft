import React, {useCallback, useState} from "react";
import {Toolbar, Drawer, Stack} from "@mui/material";
import Login from "./login";
import {useDrawerState} from "@/pc/components/nav/components/drawer/context";
import {useWallet} from "@/pc/context/wallet";
import Logged from "./logged";
import {LoadingButton} from "@mui/lab";
import {useLoading} from "@lib/react-hook";
import {clearCache} from "@/pc/services/restful";
import {useSnackbar} from "notistack";
import {useContract} from "@/pc/context/contract";

const sx = {
    width: 480,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: { width: 480, boxSizing: 'border-box' },
}
const Action:React.FC = ()=>{
    const [state,setState] = useDrawerState();
    const {visible} = state;
    const [wallet] = useWallet();
    const {isConnected,address,chainId} = wallet;
    const [clearSelf,selfLoading] = useLoading(clearCache);
    const [clearMarket,marketLoading] = useLoading(clearCache);
    const {enqueueSnackbar} = useSnackbar()
    const [contract] = useContract();
    const {data:contractMap,loading:loadChainLoading} = contract
    const handleSelfClear = useCallback(async ()=>{
        if(address&&chainId){
            const res = await  clearSelf({
                owner:address,
                chainID:chainId
            })
            if(res){
                enqueueSnackbar("清除成功",{variant:'success'})
            }

        }

    },[address, chainId, clearSelf, enqueueSnackbar])
    const handleMarketClear = useCallback(async ()=>{

        if(contractMap&&chainId){
            const contract = contractMap[chainId]
            if(contract&&contract.AuctionContractAddress){
                const res = await  clearMarket({
                    owner:contract.AuctionContractAddress,
                    chainID:chainId
                })
                if(res){
                    enqueueSnackbar("清除成功",{variant:'success'})
                }
            }
        }

    },[chainId, clearMarket, contractMap, enqueueSnackbar])

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
        <Stack direction={"column"} spacing={3} marginTop={3} paddingLeft={16} paddingRight={16}>
            <LoadingButton onClick={handleSelfClear} variant={"outlined"} loading={selfLoading}>清除物品缓存</LoadingButton>
            <LoadingButton onClick={handleMarketClear} variant={"outlined"} loading={marketLoading||loadChainLoading}>清除市场缓存</LoadingButton>
        </Stack>

        </Drawer>

}
export  default  Action;
