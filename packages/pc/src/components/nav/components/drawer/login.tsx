import React, {useCallback, useState} from "react";
import {
    Avatar,
    Box, Button,
    Divider,
    List,
    Chip,
    ListItemButton,
    ListItemText,
    ListItemAvatar, Card, Stack, Typography,

} from "@mui/material";
import  metamask from '@/pc/asset/metamask-fox.png'
import  walletlink from '@/pc/asset/walletlink-alternative.webp'
import Provider from "@/pc/instance/provider";
import {useSnackbar} from "notistack";
import {useWallet} from "@/pc/context/wallet";
import {ethers} from "ethers";

// https://api.wallet.coinbase.com/rpc/v2/desktop/chrome
// https://metamask.io/download.html
const Login :React.FC = ()=>{
    const [,setWallet] = useWallet()
    const {enqueueSnackbar} = useSnackbar()
    const handleMetamask = useCallback(async ()=>{
        const ethereum = (window as any).ethereum
        if(!ethereum){
           globalThis?.window?.open("https://metamask.io/download.html")
            return
        }else{
            const provider = await Provider.getInstance();
                if(provider){
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    const balance= await provider.getBalance(address);
                    const chainId = await signer.getChainId();
                    setWallet({
                        address,
                        balance:ethers.utils.formatEther(balance),
                        chainId:chainId.toString(),
                        isConnected:true
                    })
                }else{
                    enqueueSnackbar('链接失败,请重试', {variant: 'error'})
                }
        }
    },[enqueueSnackbar, setWallet])

    return <Card>
        <Stack direction={'row'} spacing={3} padding={3}>
            <Avatar/>
            <Typography variant={'h4'}>
                mywallet
            </Typography>
        </Stack>
        <Divider/>
        <Typography variant={'h6'} padding={3}>
            Connect with one of our available wallet providers or create a new one.
        </Typography>
        <Box padding={3}>

            <List>
                <ListItemButton onClick={handleMetamask}>
                    <ListItemAvatar>
                        <Avatar src={metamask.src}/>
                    </ListItemAvatar>
                    <ListItemText primary={'metamask'}/>
                    <Chip label="Popular" color="primary" size={"small"}/>
                </ListItemButton>
                <Divider component="li" />
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar src={walletlink.src}/>
                    </ListItemAvatar>
                    <ListItemText primary={'Coinbase Wallet'}/>
                    <Chip label="暂未开放" color="primary" size={"small"}/>
                </ListItemButton>
            </List>
        </Box>
    </Card>
}
export default React.memo(Login)
