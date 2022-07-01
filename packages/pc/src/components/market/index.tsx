import React, {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {FormatAlignLeft} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Menu,
    Paper,
    Stack,
    Toolbar,
    Typography,
    MenuItem, InputLabel, Select, FormControl, SelectChangeEvent, CardMedia, CardContent, Rating, CardActions, Card
} from "@mui/material";
import {Radio, RadioItem,RadioButton,RadioButtonItem,Dropdown} from "@lib/react-component";
import {useLoading, useMount, useSubscribe} from "@lib/react-hook";
import {getChainConfig, getNFTList, IChain, IChainContractConfig, IChainItem} from "@/pc/services/contract";
import {useWallet} from "@/pc/context/wallet";
import {useSnackbar} from "notistack";
import {switchMetamaskChain} from "@/pc/utils/metamask";
import {ethers} from "ethers";
import {numToHex} from "@/pc/utils/hex";
import {IMockChain, mockChains} from "@/pc/mock/chains";
import {heroesJson} from "@/pc/constant";
import {styled} from "@mui/material/styles";

const isMintBox = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.MintBoxContractAddress;
}
const isPreSale = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.PreSaleContractAddress;
}
const CustomCard = styled(Card)({
    '&:hover': {
        boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        position: 'relative',
        left: -1,
        top: -1
    }
})
const sortList:{label:string,value:string,labelPlacement:'end' | 'start' | 'top' | 'bottom'}[] = [{
    label:'类型',
    value:'1',
    labelPlacement:'start',
},{
    label:'tokenId',
    value:'2',
    labelPlacement:'start',
},{
    label:'售价',
    value:'3',
    labelPlacement:'start',
},{
    label:'星级',
    value:'4',
    labelPlacement:'start',
}]
const render = (item:{label:string,value:string,labelPlacement:'end' | 'start' | 'top' | 'bottom'})=>{
    return  <RadioItem sx={{justifyContent:"space-between"}} label={item.label} key={item.value} value={item.value} labelPlacement={item.labelPlacement}/>
}
const Home: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {address, balance, chainId} = wallet;
    const [loadChain,loadChainLoading] = useLoading(getChainConfig);
    const[loadNFTList,loadNFTListLoading] = useLoading(getNFTList);
    const [contractConfig,setContractConfig] = useState<IChainContractConfig|null>(null);
    const [contractMap,setContractMap] = useState<IChain>({})
    const [status,setStatus] = useState<null|'error'|'waring'|'success'|'chainNotSupport'>(null);
    const [list,setList] = useState<IChainItem[]>([]);
    const getContractAddress = useCallback(async ()=>{
        const chainConfig = await loadChain();
        if(chainConfig){
            const chains = chainConfig.Chain;
            setContractMap(chains)
        }
    },[loadChain])
    const verify = useCallback((chainId:string,contractMap:IChain)=>{
        const chain = contractMap[chainId];
        if (!chain) {
            // 不支持该链
            // enqueueSnackbar('暂不支持当前链', {variant: 'error'})
            setStatus("chainNotSupport")
            setContractConfig(null)
            return;

        }else {
            setStatus("success")
            setContractConfig(chain)
        }
    },[])
    const getNFTListByAddress = useCallback(async (chainId:string,address:string)=>{
        const res = await loadNFTList({chainID:chainId,owner:address});
        if(res){
            setList(res.items)
        }
    },[loadNFTList])

    const statusMessage = useMemo(()=>{
        if(loadChainLoading){
            return "正在检测市场是否支持当前网络"
        }
        if(loadNFTListLoading){
            return "正在获取获取NFT"
        }
        if(status=='chainNotSupport'){
            return '市场不支持当前网络'
        }
        if(status=='success'){
            return  '已链接'
        }
        },[loadChainLoading, loadNFTListLoading, status])
    const light = useMemo(()=>{
        if(loadChainLoading||loadNFTListLoading){
            return  <CircularProgress size={10} sx={{
                color:theme => theme.palette.text.primary }}/>
        }
        switch (status) {
            case 'error':
                return 'red';
            case 'chainNotSupport':
                return 'red';
            case 'success':
                return 'green';
            case 'waring':
                return 'yellow'
        }
    },[loadChainLoading, loadNFTListLoading, status])
    useMount(()=>{
        getContractAddress().then();
    })
    useSubscribe(()=>{
        if(chainId&&contractMap){
            console.log(chainId,contractMap)
            verify(chainId,contractMap)
        }

        /**
         * 每当切换链的时候，会校验一次是否支持,如果支持就把合同地址存到ref里面
         * loadChain是静态函数，也不会变化，所以不用监听
         */
    },[chainId,contractMap],[])

    useEffect(()=>{
        const address = contractConfig?.AuctionContractAddress
        if(chainId&&address){
            getNFTListByAddress(chainId,address).then()
        }

    },[chainId, contractConfig?.AuctionContractAddress, getNFTListByAddress])
    const [heroesMap,setHeroesMap] = useState<{[key:string]:string}>({})
    const initMap = useCallback(()=>{
        const map :{[key:string]:string}= {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    },[])
    useMount(()=>{
        initMap()
    })
    const listRender = useCallback(( item:IChainItem)=>{
        const rateNum =  Number.parseInt(item.quality||'1');
        const rate = rateNum==0?1:rateNum;
        let image = item.tokenUri?`https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg`: 'http://172.24.135.32:3080/static/img/empty.jpg'
        let name = heroesMap[item.tokenUri||'']
        if(chainId){
            const chainInfo = contractMap[chainId]
            if(chainInfo){
                if(isPreSale(item,chainInfo)){
                    image = "http://172.24.135.32:3080/static/img/preSale.jpg";
                    name='预售'
                }
                if(isMintBox(item,chainInfo)){
                    image = "http://172.24.135.32:3080/static/img/mintBox.jpg";
                    name='盲盒'
                }
            }

            return<Grid item={true} key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`}>
                <CustomCard  sx={{ maxWidth: 250 }}>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={image}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {name}
                        </Typography>
                        <Rating name="read-only" value={rate} readOnly />
                    </CardContent>
                    <CardActions>
                        <Button variant={"contained"} size={"small"} onClick={() => enqueueSnackbar(`开发中...`)}>购买</Button>
                    </CardActions>
                </CustomCard>
            </Grid>
        }

    },[chainId, contractMap, enqueueSnackbar, heroesMap])
    return <Box paddingLeft={6} paddingRight={6} minHeight={800}>
        <Box height={48} display={"flex"} justifyContent={"space-between"} marginTop={3}>
            <Box/>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Box>
                    <Typography color={theme=>theme.palette.text.primary}>
                    {light}
                    </Typography>
                </Box>
                <Box>
                    <Typography color={theme=>theme.palette.text.primary} whiteSpace={"nowrap"}>
                        {statusMessage}
                    </Typography>
                </Box>
                <SwitchChain chains={contractMap} chainId={chainId} loading = {loadChainLoading}/>
            </Stack>
        </Box>
        <Grid container={true} spacing={3}>
        <Grid item={true} xs={0} sm={4} md={4} lg={4} xl={2}>
            <Paper>
                <Box padding={3}>
                    <RadioButton sx={{justifyContent:'center'}} label={<Typography textAlign={'center'} variant={'h6'}>
                        布局
                    </Typography>}>
                        <RadioButtonItem key={1} value={1}>
                            <FormatAlignLeft />
                        </RadioButtonItem>
                        <RadioButtonItem key={2} value={2}>
                            <FormatAlignLeft />
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
            <Grid container spacing={2} rowSpacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                {list?.map(listRender)}
            </Grid>
        </Grid>
    </Grid>
        </Box>
}
export default Home;

const SwitchChain :React.FC<{chains:IChain,chainId?:string,loading?:boolean}> = (props)=>{
    const ref = useRef<{[key:number]:IMockChain}>({})
    const mockFunc = useCallback(()=>{
        for (const mockChain of mockChains) {
            ref.current[mockChain.chainId] = mockChain
        }
    },[])
    const {chains,chainId,loading} = props;
    const [value,setValue] = useState(chainId&&chains[chainId]?chains:'');
    // switchMetamaskChain();
    const list = useMemo(()=>{
        const list:(IChainContractConfig&{chainId:string})[] = []
        for (const chainsKey in chains) {
            if(chains.hasOwnProperty(chainsKey)){
                list.push({
                    ...chains[chainsKey],
                    chainId:chainsKey
                })
            }
        }
        return list.map((item)=>{
                return  <MenuItem key={item.chainId} value={item.chainId}>{item.Name}</MenuItem>
            })
    },[chains])
    const handleChange = useCallback(async (event: SelectChangeEvent<unknown>)=>{
        const chainId = event.target.value as string;
        try {
            const num = Number.parseInt(chainId);
            const all = ref.current[num]
            const op = {
                chainId:numToHex(all.chainId),
                chainName:all.name,
                rpcUrls:all.rpc
            }
            await switchMetamaskChain(numToHex(num),op);
        }catch (e) {
            console.log(e)
            return;
        }

        setValue(event.target.value as string);
    },[])
    useEffect(()=>{
        if(chainId&&chains[chainId]){
            setValue(chainId)
        }
    },[chainId, chains])
    useMount(()=>{
        mockFunc()
    })
    return <Box minWidth={200}><FormControl size={"small"} fullWidth>
        <InputLabel >切换已支持的链</InputLabel>
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
