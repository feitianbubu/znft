import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    SelectChangeEvent,
    CardMedia,
    CardContent,
    Rating,
    CardActions,
    Card,
    SvgIcon
} from "@mui/material";
import {Radio, RadioItem, RadioButton, RadioButtonItem, Dropdown} from "@lib/react-component";
import {useLoading, useMount, useSubscribe} from "@lib/react-hook";
import {getChainConfig, getNFTList, IChain, IChainContractConfig, IChainItem} from "@/pc/services/contract";
import {useWallet} from "@/pc/context/wallet";
import {useSnackbar} from "notistack";
import {switchMetamaskChain} from "@/pc/utils/metamask";
import {numToHex} from "@/pc/utils/hex";
import {IMockChain, mockChains} from "@/pc/mock/chains";
import {heroesJson} from "@/pc/constant";
import {styled} from "@mui/material/styles";
import {Masonry} from '@mui/lab'
import {weiToEth} from "@/pc/utils/eth";
import Round from "@lib/react-component/es/round";
// todo 现在svg太大 不知道怎么处理
const GridSvg :React.FC = ()=>{
    return <SvgIcon>
        <path
              d="M938.666667 554.624V853.333333a42.666667 42.666667 0 0 1-42.666667 42.666667h-341.333333v-341.376h384z m-469.333334 0V896H128a42.666667 42.666667 0 0 1-42.666667-42.666667v-298.709333h384zM469.333333 128v341.290667H85.333333V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h341.333333z m426.666667 0a42.666667 42.666667 0 0 1 42.666667 42.666667v298.624h-384V128h341.333333z"/>
    </SvgIcon>
}

const MasonrySvg :React.FC = ()=>{
    return <SvgIcon>
        <path
              d="M938.666667 426.624V853.333333a42.666667 42.666667 0 0 1-42.666667 42.666667h-341.333333V426.624h384z m-469.333334 256V896H128a42.666667 42.666667 0 0 1-42.666667-42.666667v-170.709333h384zM469.333333 128v469.290667H85.333333V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h341.333333z m426.666667 0a42.666667 42.666667 0 0 1 42.666667 42.666667v170.624h-384V128h341.333333z"/>
    </SvgIcon>
}
const isMintBox = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.MintBoxContractAddress;
}
const isPreSale = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.PreSaleContractAddress;
}
const mockImage = [

    'https://m.yh31.com/tp/zjbq/202109040904253416.jpg',
    'https://img.wxcha.com/m00/42/60/638abd891b32310bef50b00fa5dee34a.jpg',
    'https://i3.meixingnan.com/c5deff1b7a804511d3/918ba34d/9289a348/c28cf8062a925f008f69.jpg',
    'https://img.kuaiyong.com/pkfile/202111/02183823vmdq.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFvd9r9LC4M5Z3fUGlMnqElEckJoaP7uMfyA&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8dXROc6lez26lC3-R28Rg8QXm7QJKfj91fg&usqp=CAU',
    'https://img.haote.com/upload/news/20191108/157317782067267.jpg',
    'https://img.kuaiyong.com/pkfile/202111/02183823vmdq.jpg',
    'https://tva1.sinaimg.cn/large/9150e4e5gy1frjcs5kblwj20750h4dfv.jpg'
]
const CustomCard = styled(Card)({
    '&:hover': {
        boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        position: 'relative',
        left: -1,
        top: -1
    }
})
const sortList: { label: string, value: string, labelPlacement: 'end' | 'start' | 'top' | 'bottom' }[] = [{
    label: '类型',
    value: '1',
    labelPlacement: 'start',
}, {
    label: 'tokenId',
    value: '2',
    labelPlacement: 'start',
}, {
    label: '售价',
    value: '3',
    labelPlacement: 'start',
}, {
    label: '星级',
    value: '4',
    labelPlacement: 'start',
}]
const render = (item: { label: string, value: string, labelPlacement: 'end' | 'start' | 'top' | 'bottom' }) => {
    return <RadioItem
        sx={{justifyContent: "space-between"}}
        label={item.label}
        key={item.value}
        value={item.value}
        labelPlacement={item.labelPlacement}/>
}

enum EArrangement {
    GRID = 'grid',
    MASONRY = 'masonry'
}

const Home: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {address, balance, chainId, isConnected} = wallet;
    const [loadChain, loadChainLoading] = useLoading(getChainConfig);
    const [loadNFTList, loadNFTListLoading] = useLoading(getNFTList);
    const [contractMap, setContractMap] = useState<IChain>({})
    const [status, setStatus] = useState<null | 'error' | 'waring' | 'success' | 'chainNotSupport'>(null);
    const [list, setList] = useState<IChainItem[]>([]);
    const [arrangement, setArrangement] = useState<EArrangement.GRID | EArrangement.MASONRY>(EArrangement.GRID);
    const getContractAddress = useCallback(async () => {
        const chainConfig = await loadChain();
        if (chainConfig) {
            setContractMap(chainConfig.Chain)
        }
    }, [loadChain])
    const verify = useCallback((chainId: string, contractMap: IChain) => {
        const chain = contractMap[chainId];
        if (!chain) {
            // 不支持该链
            // enqueueSnackbar('暂不支持当前链', {variant: 'error'})
            setStatus("chainNotSupport")
            return;

        } else {
            setStatus("success")
            return chain;
        }
    }, [])
    const getNFTListByAddress = useCallback(async (chainId: string, address: string) => {
        const res = await loadNFTList({chainID: chainId, owner: address});
        if (res) {
            setList(res.items)
        }
    }, [loadNFTList])


    const [heroesMap, setHeroesMap] = useState<{ [key: string]: string }>({})
    const initMap = useCallback(() => {
        const map: { [key: string]: string } = {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    }, [])
    useMount(() => {
        initMap()
        getContractAddress().then();

    })
    /**
     * 观察者模式副作用方法
     * 当chainId变化时，检查当前的链支不支持nft市场
     */
    useSubscribe(() => {
        if (chainId && contractMap) {
            const chain = verify(chainId, contractMap)
            if (chain) {
                getNFTListByAddress(chainId, chain.AuctionContractAddress).then()
            }
        }

        /**
         * 每当切换链的时候，会校验一次是否支持,如果支持就把合同地址存到ref里面
         * getNFTListByAddress和loadChain是静态函数，不会变化，所以不用监听
         */
    }, [chainId, contractMap], [])
    const statusMessage = useMemo(() => {
        if (!isConnected) {
            return "尚未链接到钱包"
        }
        if (loadChainLoading) {
            return "正在检测市场是否支持当前网络"
        }
        if (loadNFTListLoading) {
            return "正在获取获取NFT"
        }
        if (status == 'chainNotSupport') {
            return '市场不支持当前网络'
        }
        if (status == 'success') {
            return '已链接'
        }
    }, [isConnected, loadChainLoading, loadNFTListLoading, status])
    const light = useMemo(() => {
        if (!isConnected) {
            return <Round color={'error'}/>;
        }
        if (loadChainLoading || loadNFTListLoading) {
            return <CircularProgress size={10} sx={{
                color: theme => theme.palette.text.primary
            }}/>
        }

        switch (status) {
            case 'error':
                return <Round color={'error'}/>;
            case 'chainNotSupport':
                return <Round color={'error'}/>;
            case 'success':
                return <Round color={'success'}/>;
            case 'waring':
                return <Round color={'waring'}/>;
        }
    }, [isConnected, loadChainLoading, loadNFTListLoading, status])
    const masonryItemRender = useCallback((item: IChainItem,) => {
        let image = mockImage[Math.floor(Math.random() * mockImage.length)]
        let name = heroesMap[item.tokenUri || '']
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        if (chainId) {
            const chainInfo = contractMap[chainId]
            if (chainInfo) {
                if (isPreSale(item, chainInfo)) {
                    name = '预售'
                }
                if (isMintBox(item, chainInfo)) {
                    name = '盲盒'
                }
            }
        }
        return <CustomCard
            key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`}
            elevation={0}
            variant="outlined"
        >
            <Box
                component="img"
                alt="The house from the offer."
                src={image}
                width={'100%'}

            />
            <CardContent>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography gutterBottom variant="h6" component="div">
                        {name}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {weiToEth(item.currentPrice)} eth
                    </Typography>
                </Stack>

                <Rating name="read-only" value={rate} readOnly/>
            </CardContent>
            <CardActions>
                <Button variant={"contained"} size={"small"} onClick={() => enqueueSnackbar(`开发中...`)}>购买</Button>
            </CardActions>
        </CustomCard>
    }, [chainId, contractMap, enqueueSnackbar, heroesMap])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        let image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        let name = heroesMap[item.tokenUri || '']
        if (chainId) {
            const chainInfo = contractMap[chainId]
            if (chainInfo) {
                if (isPreSale(item, chainInfo)) {
                    image = "http://172.24.135.32:3080/static/img/preSale.jpg";
                    name = '预售'
                }
                if (isMintBox(item, chainInfo)) {
                    image = "http://172.24.135.32:3080/static/img/mintBox.jpg";
                    name = '盲盒'
                }
            }

            return <Grid item={true} key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`} xs={12}
                         sm={4} md={3}>
                <CustomCard>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={image}
                    />
                    <CardContent>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Typography gutterBottom variant="h6" component="div">
                                {name}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                {weiToEth(item.currentPrice)} eth
                            </Typography>
                        </Stack>

                        <Rating name="read-only" value={rate} readOnly/>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant={"contained"}
                            size={"small"}
                            onClick={() => enqueueSnackbar(`开发中...`)}
                        >购买</Button>
                    </CardActions>
                </CustomCard>
            </Grid>
        }

    }, [chainId, contractMap, enqueueSnackbar, heroesMap])
    const NFTList = useMemo(() => {
        if (arrangement == EArrangement.GRID) {
            return <Grid container spacing={2} columns={12}>
                {list?.map(gridItemRender)}
            </Grid>
        } else if (arrangement == EArrangement.MASONRY) {
            return <Masonry columns={{xs: 1, sm: 3, md: 4}} spacing={2}>
                {list.map(masonryItemRender)}
            </Masonry>
        }
    }, [arrangement, gridItemRender, list, masonryItemRender])
    const handleArrangementChange = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, value?: string) => {
        if (value) {
            setArrangement(value as EArrangement)
        }
    }, [])
    return <Box paddingLeft={6} paddingRight={6} minHeight={800}>
        <Box height={48} display={"flex"} justifyContent={"space-between"} marginTop={3} marginBottom={3}>
            <Box/>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                {light}
                <Box>
                    <Typography color={theme => theme.palette.text.primary} whiteSpace={"nowrap"}>
                        {statusMessage}
                    </Typography>
                </Box>
                <SwitchChain chains={contractMap} chainId={chainId} loading={loadChainLoading}/>
            </Stack>
        </Box>
        <Grid container={true} spacing={3}>
            <Grid item={true} xs={0} sm={4} md={4} lg={4} xl={2}>
                <Paper>
                    <Box padding={3}>
                        <RadioButton
                            onChange={handleArrangementChange}
                            sx={{justifyContent: 'center'}}
                            value={arrangement}
                            label={<Typography
                                textAlign={'center'}
                                variant={'h6'}>
                                布局
                            </Typography>}>
                            <RadioButtonItem key={EArrangement.GRID} value={EArrangement.GRID}>
                                网格布局
                            </RadioButtonItem>
                            <RadioButtonItem key={EArrangement.MASONRY} value={EArrangement.MASONRY}>
                                流式布局
                            </RadioButtonItem>
                        </RadioButton>
                    </Box>
                    <Divider/>
                    <Box padding={3}>
                        <Radio label={<Typography textAlign={'center'} variant={'h6'}>
                            排序
                        </Typography>}>
                            {sortList.map(render)}
                        </Radio>
                    </Box>
                </Paper>
            </Grid>
            <Grid item={true} xs={12} sm={8} md={8} lg={8} xl={10}>
                {NFTList}
            </Grid>
        </Grid>
    </Box>
}
export default React.memo(Home);

const SwitchChain: React.FC<{ chains: IChain, chainId?: string, loading?: boolean }> = (props) => {
    const ref = useRef<{ [key: number]: IMockChain }>({})
    const mockFunc = useCallback(() => {
        for (const mockChain of mockChains) {
            ref.current[mockChain.chainId] = mockChain
        }
    }, [])
    const {chains, chainId, loading} = props;
    const [value, setValue] = useState(chainId && chains[chainId] ? chains : '');
    const list = useMemo(() => {
        const list: (IChainContractConfig & { chainId: string })[] = []
        for (const chainsKey in chains) {
            if (chains.hasOwnProperty(chainsKey)) {
                list.push({
                    ...chains[chainsKey],
                    chainId: chainsKey
                })
            }
        }
        return list.map((item) => {
            return <MenuItem key={item.chainId} value={item.chainId}>{item.Name}</MenuItem>
        })
    }, [chains])
    const handleChange = useCallback(async (event: SelectChangeEvent<unknown>) => {
        const chainId = event.target.value as string;
        try {
            const num = Number.parseInt(chainId);
            const all = ref.current[num]
            const op = {
                chainId: numToHex(all.chainId),
                chainName: all.name,
                rpcUrls: all.rpc
            }
            await switchMetamaskChain(numToHex(num), op);
        } catch (e) {
            console.log(e)
            return;
        }

        setValue(event.target.value as string);
    }, [])
    useEffect(() => {
        if (chainId && chains[chainId]) {
            setValue(chainId)
        }
    }, [chainId, chains])
    useMount(() => {
        mockFunc()
    })
    return <Box minWidth={200}><FormControl size={"small"} fullWidth>
        <InputLabel>切换已支持的链</InputLabel>
        <Select
            fullWidth={true}
            value={value}
            onChange={handleChange}
            size={"small"}
            label="切换已支持的链" // add this
            disabled={loading}
        >
            {list}
        </Select>
    </FormControl>
    </Box>
}
