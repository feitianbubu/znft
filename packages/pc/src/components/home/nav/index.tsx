import React, {useCallback} from "react";
import {AppBar, Box, Button, Chip, Divider} from '@mui/material'
import {styled} from '@mui/material/styles';
import {useWallet} from "@/pc/context/wallet";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';
import {useFilter} from "@/pc/components/home/body/context/filter-context";
import {EFilter} from "@/pc/constant/enum";
import { useSnackbar } from 'notistack';
const pages = [
    {name: '市场', id: 'market'},
    {name: '我的', id: 'my'},
    {name: '案例', id: 'case'},
    {name: '游戏', id: 'game'},
    {name: '下载', id: 'download'},
    {name: '文档', id: 'document'},
    {name: '联系我们', id: 'contact'},
];
const Banner = styled("div")({
    padding: '5px 5px',
    display: 'flex',
    justifyContent: "space-between"
})
const UserBox = styled('div')({display: 'flex', alignItems: 'center', marginRight: '20px'})
const ActionBox = styled('div')({display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'})
const Logo = styled('div')({
    height: '55px',
    margin: '0 20px',
    fontWeight: 'bold',
    fontSize: 32
})
const Nav: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();``
    const {address, balance, chainId} = useWallet();
    let showAddress = address && address.substring(0, 6) + '...' + address.substring(address.length - 4);
    let showBalance = parseFloat(balance).toFixed(4)
    let connectBtnName = '连接钱包';
    const url = process.env.NEXT_PUBLIC_API_URL;
    const handleClearCache = useCallback(async () => {
        let owner = address;
        let chainID = chainId;
        let body = {
            owner,
            chainID
        }
        enqueueSnackbar('正在清除...', {variant: 'info'})
        try {
            let res = await fetch(url + '/ClearCache', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            await res.json();
            enqueueSnackbar(`清除成功`, {variant: 'success'})
        } catch (e) {
            enqueueSnackbar('清除失败:${e}', {variant: 'warning'})
        }
    }, [address, chainId, enqueueSnackbar, url]);
    const [selectPageId, setSelectPageId] = React.useState<string>(pages[0].id);
    let [, setFilter] = useFilter();
    const handleChangePage = useCallback((id: string) => {
        setSelectPageId(id);
        setFilter(id === 'my' ? EFilter.我的 : EFilter.市场);
    }, [setFilter]);
    const handleFaucet = useCallback(async () => {
        // 判断是否开发网
        let devChainId = '31337';
        if (chainId !== devChainId) {
            enqueueSnackbar(`请切换到开发网络${devChainId}`, {variant: 'warning'});
            return;
        }
    }, [chainId, enqueueSnackbar]);

    return <>
        <AppBar position="relative">
            <Banner>
                <Logo>
                    Z-GAMEFI
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
                        <Button color="inherit" onClick={handleClearCache}>刷新缓存</Button>
                        <Chip sx={{border: '0'}} icon={<PersonIcon fontSize="small"/>} label={showAddress}
                              variant="outlined" clickable={true}/>
                        <Chip sx={{border: '0'}} icon={<AttachMoneyIcon fontSize="small"/>} label={showBalance} variant="outlined"
                              clickable={true}/>
                        <Chip sx={{border: '0'}} icon={<TuneIcon fontSize="small"/>} label={chainId} variant="outlined" clickable={true}/>
                    </UserBox>
                    <ActionBox>
                    </ActionBox>
                </Box>
            </Banner>
        </AppBar>
        <Divider/>
    </>
}
export default Nav;
