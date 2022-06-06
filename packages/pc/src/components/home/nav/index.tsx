import React, {useCallback} from "react";
import {AppBar, Box, Button, Chip, Divider} from '@mui/material'
import {styled} from '@mui/material/styles';
import {useWallet} from "@/pc/context/wallet";
import {message} from "@lib/util";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';

const pages = [
    {name: '市场', id: 'market'},
    {name: '我的', id: 'my'},
    {name: '空投', id: 'mint'},
    {name: '兑换', id: 'swap'}
];
const Banner = styled("div")({
    padding: '5px 5px',
    display: 'flex',
    justifyContent: "space-between"
})
const UserBox = styled('div')({display: 'flex', alignItems: 'center', marginRight: '20px'})
const ActionBox = styled('div')({display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'})
const Logo = styled('div')({
    margin: '0 20px',
    fontWeight: 'bold',
    fontSize: 32
})
const Nav: React.FC = () => {
    const {address, balance, chainId} = useWallet();
    let showAddress = address && address.substring(0, 6) + '...' + address.substring(address.length - 4);
    let showBalance = parseFloat(balance).toFixed(4)
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
    }, [address, chainId, url]);
    const [selectPageId, setSelectPageId] = React.useState<string>(pages[0].id);
    const handleChangePage = useCallback((id: string) => {
        setSelectPageId(id);
    }, [setSelectPageId]);

    return <>
        <AppBar position="relative">
            <Banner>
                <Logo>
                    Z-NFT
                </Logo>
                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                    {pages.map((page) => (<Button
                        color={selectPageId === page.id ? 'warning' : 'inherit'}
                        key={page.id}
                        id={page.id}
                        size={'large'}
                        sx={{
                            fontWeight: 'bold', fontSize: '1.2rem', mr: 2, display: {xs: 'none', md: 'flex'}
                        }}
                        onClick={() => handleChangePage(page.id)}
                    >
                        {page.name}
                    </Button>))}
                </Box>
                <Box>
                    <UserBox>
                        <Chip sx={{border: '0'}} icon={<PersonIcon fontSize="small"/>} label={showAddress}
                              variant="outlined" clickable={true}/>
                        <Chip sx={{border: '0'}} icon={<AttachMoneyIcon fontSize="small"/>} label={showBalance} variant="outlined"
                              clickable={true}/>
                        <Chip sx={{border: '0'}} icon={<TuneIcon fontSize="small"/>} label={chainId} variant="outlined" clickable={true}/>
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
