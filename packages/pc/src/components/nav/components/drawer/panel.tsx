import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Box, Button, Drawer, IconButton, Menu, MenuItem} from "@mui/material";
import {useDrawerState} from "@/pc/components/nav/components/drawer/context";
import {Dropdown} from "@lib/react-component/lib/dropdown";
import {AccountBalanceWalletOutlined, AccountCircleOutlined} from "@mui/icons-material";
import Action from "./action";
import {useWallet} from "@/pc/context/wallet";
import {useClintNavigation} from "@/pc/hook/navigation";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";
import {Identicon} from "@lib/util";

// https://api.wallet.coinbase.com/rpc/v2/desktop/chrome
// https://metamask.io/download.html

const overlay = <Menu open={false}
>
    <MenuItem  key={'/profile'}>个人主页</MenuItem>
    <MenuItem key={'/create'}>铸造</MenuItem>
</Menu>
const ButtonLink = styled(Box)<{ selected?: boolean }>(({selected, theme}) => ({
    borderBottomWidth: selected ? 2 : 0,
    borderBottomColor: theme.palette.text.primary,
    borderBottomStyle: 'solid',
}))
const Panel:React.FC = ()=>{
    const [,setState] = useDrawerState();
    const [navigation] = useClintNavigation()
    const [wallet ] = useWallet()
    const router = useRouter();
    const {pathname} = router
    const [base64,setBase64] = useState("");
    const {isConnected,address} = wallet;
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
    const handleClick = useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>,key?:React.Key|null)=>{
        if(key){
            navigation.push(key.toString()).then()
        }
    },[navigation])
    return <>
        <Action/>
        <ButtonLink
            display={'flex'}
            textAlign={'center'}
            alignItems={'center'}
            justifyContent={'center'}
            selected={pathname.startsWith("/profile")}
        >
            <Dropdown
                preShow={handlePreShow}
                overlay={overlay}
                onClick={handleClick}
            >
                <IconButton style={{width:42}}>
                    {isConnected? <Avatar src={base64} sx={{width:24,height:24}}/>:<AccountCircleOutlined/>}
                </IconButton>
            </Dropdown>
        </ButtonLink>

        <IconButton style={{width:50}} onClick={handleOpen}>
            <AccountBalanceWalletOutlined/>
        </IconButton>
    </>

}
export  default  Panel;
