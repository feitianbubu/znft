import React, {
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import {getHeroClockAction, getHeroCore, getNFTList, IChainContractConfigMap, IChainItem} from "@/pc/services/contract";
import {CustomCard, EArrangement} from "@/pc/components/market";
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardMedia, CircularProgress,
    Divider,
    Grid,
    Rating,
    Stack, TextField,
    Typography
} from "@mui/material";
import {Masonry} from "@mui/lab";
import {ethToWei, weiToEth} from "@/pc/utils/eth";
import {heroesJson} from "@/pc/constant";
import {useLoading, useMount} from "@lib/react-hook";
import {useSnackbar} from "notistack";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {BigNumber, ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import Provider from "@/pc/instance/provider";
import {LoadingButton} from '@mui/lab'
import {Modal} from "@lib/react-component";

// const mockImage = [
//     'https://m.yh31.com/tp/zjbq/202109040904253416.jpg',
//     'https://img.wxcha.com/m00/42/60/638abd891b32310bef50b00fa5dee34a.jpg',
//     'https://i3.meixingnan.com/c5deff1b7a804511d3/918ba34d/9289a348/c28cf8062a925f008f69.jpg',
//     'https://img.kuaiyong.com/pkfile/202111/02183823vmdq.jpg',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFvd9r9LC4M5Z3fUGlMnqElEckJoaP7uMfyA&usqp=CAU',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8dXROc6lez26lC3-R28Rg8QXm7QJKfj91fg&usqp=CAU',
//     'https://img.haote.com/upload/news/20191108/157317782067267.jpg',
//     'https://img.kuaiyong.com/pkfile/202111/02183823vmdq.jpg',
//     'https://tva1.sinaimg.cn/large/9150e4e5gy1frjcs5kblwj20750h4dfv.jpg'
// ]
const Hero: React.FC<{ contractMap: IChainContractConfigMap, list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {contractMap, list, arrangement, loading} = props;
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {chainId, address} = wallet;
    const [heroesMap, setHeroesMap] = useState<{ [key: string]: string }>({});
    const [auctionAbi, setAuctionAbi] = useState<ContractInterface>();
    const [heroAbi, setHeroAbi] = useState<ContractInterface>();
    const [onSaleVisible,setOnSaleVisible] = useState(false);
    const [onSaleSelected,setOnSaleSelected] = useState<IChainItem|undefined>(undefined)
    const [sendVisible,setSendVisible] = useState(false);
    const [sendSelected,setSendSelected] = useState<IChainItem|undefined>(undefined)
    const initMap = useCallback(() => {
        const map: { [key: string]: string } = {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    }, [])
    const [loadAuctionAbi, auctionAbiLoading] = useLoading(getHeroClockAction);
    const [loadHeroAbi, heroAbiLoading] = useLoading(getHeroCore);
    const auctionContractInstanceRef = useRef<ethers.Contract | null>();
    const heroContractInstanceRef = useRef<ethers.Contract | null>();
    const [connectLoading, setConnectLoading] = useState(true)
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, auctionAbi:ContractInterface,heroAbi: ContractInterface,address:string) => {
        setConnectLoading(true)
        const auctionAddress = contractMap[chainId]?.AuctionContractAddress;
        const heroAddress = contractMap[chainId]?.HeroContractAddress;
        const provider = await Provider.getInstance();
        if(provider){
            let singer
            try {
                singer = provider.getSigner();
            }catch (e) {
                enqueueSnackbar("签名失败，请刷新页面",{variant:"error"})
                setConnectLoading(false)
            }

            if (auctionAddress) {
                const auctionContractInstance: ethers.Contract | null = new ethers.Contract(auctionAddress, auctionAbi, singer);
                auctionContractInstanceRef.current = auctionContractInstance
            }
            if(heroAddress){
                const heroContractInstance: ethers.Contract | null = new ethers.Contract(heroAddress, heroAbi, singer);
                heroContractInstanceRef.current = heroContractInstance
            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])

    const getAuctionAbi = useCallback(async () => {
        const res = await loadAuctionAbi();
        if (res) {
            setAuctionAbi(res)
        }
    }, [loadAuctionAbi])
    const getHeroAbi = useCallback(async () => {
        const res = await loadHeroAbi();
        if (res) {
            setHeroAbi(res)
        }
    }, [loadHeroAbi])
    const saleFormRef= useRef<{ startingPrice: number, endingPrice: number, duration: number,gasLimit:number,gasPrice:number  }>(null)
    const handleSale = useCallback(async ()=>{
        const auctionContract = auctionContractInstanceRef.current
        const saleForm = saleFormRef.current
        if(chainId&& auctionContract&&saleForm){
            const chain = contractMap[chainId]
            const {startingPrice,endingPrice,duration,gasLimit,gasPrice } = saleForm
            if(chain&&onSaleSelected){
                const startingPriceWei = ethToWei(startingPrice.toString())
                const endingPriceWei = ethToWei(endingPrice.toString())
                const params = {
                    from:address,
                    gasPrice,gasLimit
                }
                try {

                  await auctionContract.createAuction(chain.HeroContractAddress,onSaleSelected.tokenId,startingPriceWei,endingPriceWei,duration,params);
                    enqueueSnackbar("上架成功,等待链上确认",{variant:'success'});
                    setOnSaleSelected(undefined)
                    setOnSaleVisible(false)
                }catch (e:any) {
                    console.log(e)
                    enqueueSnackbar(`上架失败:${e.message}`,{variant:'error'})
                }

            }else{
                enqueueSnackbar("当前不支持",{variant:'error'})
            }
        }else{
            enqueueSnackbar("请链接钱包",{variant:'error'})
        }

    },[address, chainId, contractMap, enqueueSnackbar, onSaleSelected])
    const sendFormRef= useRef<{ to: string,gasLimit:number,gasPrice:number  }>(null)
    const handleSend= useCallback(async ()=>{
        const heroContract = heroContractInstanceRef.current
        const sendForm = sendFormRef.current
        if(chainId&& heroContract&&sendForm){
            const chain = contractMap[chainId]
            const {gasLimit,gasPrice,to } = sendForm
            if(chain&&sendSelected){
                const params = {
                    from:address,
                    gasPrice,gasLimit
                }
                try {

                    await heroContract.safeTransferFrom(address, to,sendSelected.tokenId,params);
                    enqueueSnackbar("发送成功,等待链上确认",{variant:'success'});
                    setSendSelected(undefined)
                    setSendVisible(false)
                }catch (e:any) {
                    console.log(e)
                    enqueueSnackbar(`发送失败:${e.message}`,{variant:'error'})
                }

            }else{
                enqueueSnackbar("当前不支持",{variant:'error'})
            }
        }else{
            enqueueSnackbar("请链接钱包",{variant:'error'})
        }
    },[address, chainId, contractMap, enqueueSnackbar, sendSelected])
    useMount(() => {
        initMap()
        getAuctionAbi().then()
        getHeroAbi().then()
    })
    /**
     * 构建合同
     */
    useEffect(() => {
        if (chainId && auctionAbi&&heroAbi&&address) {
            connectContract(contractMap, chainId, auctionAbi,heroAbi,address).then()
        }
    }, [chainId, connectContract, contractMap, address, auctionAbi, heroAbi])
    const masonryItemRender = useCallback((item: IChainItem,) => {
        const image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        const name = heroesMap[item.tokenUri || '']
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const onSale = ()=>{
            setOnSaleVisible(true)
            setOnSaleSelected(item)
        }
        const onSend = ()=>{
            setSendVisible(true)
            setSendSelected(item)
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
                <LoadingButton
                    loading={connectLoading || auctionAbiLoading}
                    data-id={item.tokenId}
                    data-value = {item.currentPrice}
                    variant={"contained"}
                    size={"small"}
                    onClick={onSale}
                >
                    上架
                </LoadingButton>

                <LoadingButton
                    loading={connectLoading || auctionAbiLoading}
                    data-id={item.tokenId}
                    data-value = {item.currentPrice}
                    variant={"contained"}
                    size={"small"}
                    onClick={onSend}
                >
                    赠送
                </LoadingButton>
            </CardActions>
        </CustomCard>
    }, [auctionAbiLoading, connectLoading, heroesMap])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        const name = heroesMap[item.tokenUri || '']
        const onSale = ()=>{
            setOnSaleVisible(true)
            setOnSaleSelected(item)
        }
        const onSend = ()=>{
            setSendVisible(true)
            setSendSelected(item)
        }
        return <Grid item={true} key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`} xs={12}
                     sm={4} md={3}>
            <CustomCard elevation={0} variant={'outlined'}>
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
                    <LoadingButton
                        loading={connectLoading || auctionAbiLoading}
                        data-id={item.tokenId}
                        data-value = {item.currentPrice}
                        variant={"contained"}
                        size={"small"}
                        onClick={onSale}
                    >
                        上架
                    </LoadingButton>

                    <LoadingButton
                        loading={connectLoading || auctionAbiLoading}
                        data-id={item.tokenId}
                        data-value = {item.currentPrice}
                        variant={"contained"}
                        size={"small"}
                        onClick={onSend}
                    >
                        赠送
                    </LoadingButton>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [heroesMap, connectLoading, auctionAbiLoading])
    const heroList = useMemo(() => {
        if (loading) {
            return;
        }
        if (list.length == 0) {
            return <Box minHeight={160} display={"flex"} alignItems={"center"} justifyContent={"center"}><Typography
                color={theme => theme.palette.text.primary} variant={'h6'} textAlign={"center"}>
                暂无项目
            </Typography>
            </Box>
        }
        if (arrangement == EArrangement.GRID) {
            return <Grid container spacing={2} columns={12}>
                {list?.map(gridItemRender)}
            </Grid>
        } else if (arrangement == EArrangement.MASONRY) {
            return <Masonry columns={{xs: 1, sm: 3, md: 4}} spacing={2}>
                {list.map(masonryItemRender)}
            </Masonry>
        }
    }, [arrangement, gridItemRender, list, loading, masonryItemRender])
    const handleOnSaleCancel = useCallback(()=>{
        setOnSaleVisible(false);
        setOnSaleSelected(undefined)
    },[])
    const handleSendCancel = useCallback(()=>{
        setSendVisible(false);
        setSendSelected(undefined)
    },[])
    const _loading = useMemo(()=>{
       return auctionAbiLoading||loading||heroAbiLoading||connectLoading
    },[auctionAbiLoading, connectLoading, heroAbiLoading, loading])
    return <Box>
        <Modal
            open={onSaleVisible}
            title={'上架'}
            onCancel={handleOnSaleCancel}
            onOk={handleSale}
            keepMounted={true}
        >
            <SaleFormRef name={heroesMap[onSaleSelected?.tokenUri || '']} ref={saleFormRef}/>
        </Modal>
        <Modal
            open={sendVisible}
            title={'赠送'}
            onCancel={handleSendCancel}
            onOk={handleSend}
            keepMounted={true}
        >
            <SendFormRef name={heroesMap[sendSelected?.tokenUri || '']} ref={sendFormRef}/>
        </Modal>
        <Divider sx={{marginBottom: 3}}/>
        {_loading?<Box display={'flex'} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}
                         minHeight={900}>
            <CircularProgress sx={{
                color: theme => theme.palette.text.primary
            }}/>
        </Box>:heroList}
    </Box>
}
export default Hero;
const SaleForm: ForwardRefRenderFunction<{ startingPrice: number, endingPrice: number, duration: number,gasLimit:number,gasPrice:number }, { name?: string }> = (props, ref) => {
    const [startingPrice, setStartingPrice] = useState(0)
    const [endingPrice, setEndingPrice] = useState(1)
    const [duration, setDuration] = useState(3600)
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)

    const handleStartingPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseFloat(e.target.value)
        setStartingPrice(isNaN(_value) ? 0 : _value)
    }, [])
    const handleEndingPricePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseFloat(e.target.value)
        setEndingPrice(isNaN(_value) ? 1 : _value)
    }, [])
    const handleDurationChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setDuration(isNaN(_value) ? 3600 : _value)
    }, [])
    const handleGasPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setGasPrice(isNaN(_value) ? 20 : _value)
    }, [])
    const handleGasLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setGasLimit(isNaN(_value) ? 21000 : _value)
    }, [])
    useImperativeHandle(ref, () => ({
        startingPrice,
        endingPrice,
        duration,
        gasPrice,
        gasLimit
    }), [duration, endingPrice, gasLimit, gasPrice, startingPrice])
    return <>
        <Stack direction={"column"} spacing={3} marginTop={3}>
            <Typography>
                上架 {props.name || ''}
            </Typography>
            <TextField
                label="最低价"
                type={"number"}
                value={startingPrice}
                onChange={handleStartingPriceChange}
                helperText={'单位：eth'}
            />
            <TextField
                label="最高价"
                type={"number"}
                value={endingPrice}
                onChange={handleEndingPricePriceChange}
                helperText={'单位：eth'}
            />
            <TextField
                label="上架时长"
                type={"number"}
                value={duration}
                onChange={handleDurationChange}
                helperText={'单位：秒'}
            />
            <TextField
                label="gasPrice"
                type={"number"}
                value={gasPrice}
                onChange={handleGasPriceChange}
                helperText={'单位：wei'}
            />
            <TextField
                label="gasLimit"
                type={"number"}
                value={gasLimit}
                onChange={handleGasLimitChange}
                helperText={'单位：wei'}
            />
        </Stack>

    </>
}
const SaleFormRef = React.forwardRef(SaleForm);

const SendForm: ForwardRefRenderFunction<{ to: string,gasLimit:number,gasPrice:number }, { name?: string }> = (props, ref) => {
    const [to, setTo] = useState("")
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)

    const handleToChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTo(e.target.value)
    }, [])
    const handleGasPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setGasPrice(isNaN(_value) ? 20 : _value)
    }, [])
    const handleGasLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setGasLimit(isNaN(_value) ? 21000 : _value)
    }, [])
    useImperativeHandle(ref, () => ({
        to,
        gasPrice,
        gasLimit
    }), [to,gasLimit,gasPrice])
    return <>
        <Stack direction={"column"} spacing={3} marginTop={3}>
            <Typography>
                赠送 {props.name || ''}
            </Typography>
            <TextField
                label="地址"
                value={to}
                onChange={handleToChange}
                helperText={'收件人地址'}
            />
            <TextField
                label="gasPrice"
                type={"number"}
                value={gasPrice}
                onChange={handleGasPriceChange}
                helperText={'单位：wei'}
            />
            <TextField
                label="gasLimit"
                type={"number"}
                value={gasLimit}
                onChange={handleGasLimitChange}
                helperText={'单位：wei'}
            />
        </Stack>

    </>
}
const SendFormRef = React.forwardRef(SendForm);
