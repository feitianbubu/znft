import React, {useCallback, useEffect, useMemo, useState} from "react";
import {copy, ellipsisAddress, Identicon} from '@lib/util'
import {
    Avatar,
    Box, Button,
    Divider,
    List,
    Chip,
    ListItemButton,
    ListItemText,
    ListItemAvatar, Stack, Typography,
    Paper, Menu, MenuItem
} from "@mui/material";
import {styled} from "@mui/material/styles";
import  metamask from '@/pc/asset/metamask-fox.svg'
import  walletlink from '@/pc/asset/walletlink-alternative.webp'
import {useWallet} from "@/pc/context/wallet";
import {Copy,Dropdown} from "@lib/react-component";
import {KeyboardArrowDown} from "@mui/icons-material";
const ActionItem = styled(MenuItem)`
width: 200px;
  justify-content: center;
`

const Logged :React.FC = ()=>{
    const [wallet,setWallet] = useWallet();
    const {address,balance} = wallet;
    const [base64,setBase64] = useState("");
    const createAvatar = useCallback(async (address:string)=>{
        const res = await Identicon.createIcon({seed:address});
        if(res){
            setBase64(res);
        }

    },[])
    useEffect(()=>{
        if(address){
            createAvatar(address).then()
        }
    },[address, createAvatar])
    const handleLogout = useCallback(()=>{
        setWallet({
            isConnected:false,
            address:'',
            balance:'',
            chainId:''
        })
    },[setWallet])
    const overlay = useMemo(()=>{
        return <Menu  open={false}
        >
            <ActionItem key={1} onClick={handleLogout}>logout</ActionItem>
        </Menu>
    },[handleLogout])
    // import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
    return <Paper>
        <Box padding={3} display={'flex'} justifyContent={"space-between"} alignItems={"center"}>
            <Dropdown overlay={overlay}>
                <Stack direction={'row'} spacing={3} alignItems={"center"}>
                    <Avatar src={base64}/>
                    <Typography variant={'h4'}>
                        wallet
                    </Typography>
                    <KeyboardArrowDown/>
                </Stack>
            </Dropdown>

            <Copy text={address}>
                <Chip label={ellipsisAddress(address)}/>
            </Copy>

        </Box>

        <Divider/>
        <Box padding={3}>

            <Typography variant={'h5'} textAlign={'center'}>
                账户余额
            </Typography>
            <Typography variant={'h4'} textAlign={'center'}>
                {balance}
            </Typography>
        </Box>
    </Paper>
}
export default React.memo(Logged)
