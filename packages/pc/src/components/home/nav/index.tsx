import React from "react";
import {Divider   } from '@mui/material'
import { styled } from '@mui/material/styles';
import {useWallet} from "@/pc/context/wallet";

const Box = styled("div")({
    // color:'red'
    padding:'12px 24px',
    height:72,
    lineHeight:'48px',
    display:'flex',

    justifyContent:"space-between"
})
const Action = styled('div')({
    display:'inline-flex',
    gap:16
})
const Logo = styled('div')({
    fontWeight: 'bold',
    fontSize: 36
})
const Nav:React.FC = ()=>{
    const {address,balance,chainId} = useWallet();
    return <>
        <Box>
            <Logo>
                z-nft
            </Logo>
            <Action>
            <div>
                account:{address}
            </div>
            <div>
                balance:{balance}
            </div>
            <div>
                chainId:{chainId}
            </div>
            </Action>
        </Box>
        <Divider />
    </>
}
export default Nav;
