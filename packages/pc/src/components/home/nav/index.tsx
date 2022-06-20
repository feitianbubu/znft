import React, {useCallback} from "react";
import {
    AppBar,
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material'
import {styled} from '@mui/material/styles';
import {useWallet} from "@/pc/context/wallet";
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';
import {useFilter} from "@/pc/components/home/body/context/filter-context";
import {EFilter} from "@/pc/constant/enum";
import {useSnackbar} from 'notistack';
import Switch from '@mui/material/Switch';
import {ColorModeContext} from "@/pc/pages/_app";
import {getChainConfig} from "@/pc/services/contract";

const MaterialUISwitch = styled(Switch)(({theme}) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const pages = [
    {name: '市场', id: 'market'},
    {name: '我的', id: 'my'},
    {name: '案例', id: 'case', disabled:true},
    {name: '游戏', id: 'game', disabled:true},
    {name: '下载', id: 'download', disabled:true},
    {name: '文档', id: 'document', href:'https://fu-xing-min.gitbook.io/z-gamefi-docs/'},
    {name: '联系我们', id: 'contact', disabled:true},
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
    const {enqueueSnackbar} = useSnackbar();
    const {address, balance, chainId} = useWallet();
    let showAddress = address && address.substring(0, 6) + '...' + address.substring(address.length - 4);
    const colorMode = React.useContext(ColorModeContext);
    let showBalance = parseFloat(balance).toFixed(4)
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
    const handleChangePage = useCallback((page:any) => {
        const id = page.id;
        setSelectPageId(id);
        setFilter(id === 'my' ? EFilter.我的 : EFilter.市场);
        if(page.href){
            // 打开新页面
            window.open(page.href);
        }
    }, [setFilter]);
    const [selectChainId, setSelectChainId] = React.useState<string>(chainId || '31337');
    React.useEffect(function () {
        console.log('selectChainId', selectChainId, chainId);
        if(!chainId){
            return;
        }
        Promise.all([getChainConfig()]).then(
            ([chainConfig]) => {
                console.log('chainConfig', chainConfig);
                const chain = chainConfig?.Chain[chainId];
                if (!chain) {
                    // 不支持该链
                    enqueueSnackbar('不支持该链, 请点击右上角网络下拉菜单切换', {variant: 'error'})
                    // return;
                }
                setSelectChainId(chainId);
            });
    }, [enqueueSnackbar, selectChainId, chainId]);
    const handleChange = (event: SelectChangeEvent) => {
        // 切换网络
        const switchChain = async function (chainId: string) {
            const ethereum = (window as any).ethereum
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId}],
                });
                setSelectChainId(event.target.value);
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902 && chainId === '0x7a69') {
                    try {
                        let chainName = 'hardhat';
                        let rpcUrls = ['https://hardhat.tevat.dev/'];
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId,
                                    chainName,
                                    rpcUrls,
                                },
                            ],
                        });
                    } catch (addError) {
                        console.log('addError', addError);
                    }
                    return;
                }
                console.log(`切换失败${switchError.toString()}`, switchError, chainId);
                enqueueSnackbar(`切换失败${switchError.toString()}`, {variant: 'error'});
            }
        }

        // 转为16进制
        let switchChainId = '0x'+parseInt(event.target.value).toString(16);
        switchChain(switchChainId).then();
    };

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
                        disabled={page.disabled}
                        size={'large'}
                        sx={{
                            fontWeight: 'bold', fontSize: '1.2rem', mr: 2, display: {xs: 'none', md: 'flex'}
                        }}
                        onClick={() => handleChangePage(page)}
                    >
                        {page.name}
                    </Button>))}
                </Box>
                <Box>
                    <UserBox>
                        <FormControl sx={{minWidth: 120}} required>
                            <InputLabel>网络</InputLabel>
                            <Select label="网络" value={selectChainId} onChange={handleChange} sx={{height:40}}>
                                <MenuItem value={31337}>Private</MenuItem>
                                <MenuItem value={3}>Ropsten</MenuItem>
                                <MenuItem value={80001}>Polygon Mumbai</MenuItem>
                                <MenuItem value={97}>Binance Testnet</MenuItem>
                            </Select>
                        </FormControl>
                        <MaterialUISwitch sx={{m: 1}} defaultChecked onChange={colorMode.toggleColorMode}/>
                        <Button color="inherit" onClick={handleClearCache}>刷新缓存</Button>
                        <Chip sx={{border: '0'}} icon={<PersonIcon fontSize="small"/>} label={showAddress}
                              variant="outlined" clickable={true}/>
                        <Chip sx={{border: '0'}} icon={<AttachMoneyIcon fontSize="small"/>} label={showBalance}
                              variant="outlined"
                              clickable={true}/>
                        <Chip sx={{border: '0'}} icon={<TuneIcon fontSize="small"/>} label={chainId} variant="outlined"
                              clickable={true}/>
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
