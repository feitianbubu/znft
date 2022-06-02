import React, {useCallback} from "react";
import {AppBar, Box, Button, Divider} from '@mui/material'
import {styled} from '@mui/material/styles';
import {useWallet} from "@/pc/context/wallet";
import {message} from "@lib/util";

const Banner = styled("div")({
    padding: '5px 5px',
    display: 'flex',
    justifyContent: "space-between"
})
const UserBox = styled('div')({
    height: 20,
})
const ActionBox = styled('div')({display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'})
const Name = styled('span')({
    color: '#bdbdbd',
    paddingLeft: '8px'
})
const Logo = styled('div')({
    fontWeight: 'bold',
    fontSize: 32
})
const Nav: React.FC = () => {
    const {address, balance, chainId} = useWallet();
    let connectBtnName = '连接钱包';
    const url = process.env.NEXT_PUBLIC_API_URL;
    const handleClick = useCallback(async () => {

    }, []);
    const handleClearCache = useCallback(async () => {
        let owner = address;
        let chainID = chainId;
        let body = {
            owner,
            chainID
        }
        message.loading('正在清除...')
        try {
            let res = await fetch(url + '/ClearCache', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            let json = await res.json();
            message.success(`清除成功:${json}`);
        } catch (e) {
            message.warning(`清除失败:${e}`);
        }
    }, [address, chainId, url])

    return <>
        <AppBar position="relative">
            <Banner>
                <Logo>
                    Z-NFT
                </Logo>
                <Box>
                    <UserBox>
                        <span>
                            <Name>account:</Name>{address}
                        </span>
                        <span>
                            <Name>balance:</Name>{parseFloat(balance).toFixed(4)}
                        </span>
                        <span>
                            <Name>chainId:</Name>{chainId}
                        </span>
                    </UserBox>
                    <ActionBox>
                        <Button color="inherit" onClick={handleClearCache}>刷新缓存</Button>
                        <Button id="connectBtn"
                                color="inherit"
                                onClick={handleClick}>{connectBtnName}</Button>
                    </ActionBox>
                </Box>
            </Banner>
        </AppBar>
        <Divider/>
    </>
}
export default Nav;
