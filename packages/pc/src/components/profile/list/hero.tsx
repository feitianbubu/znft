import React, {
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import {IChainContractConfigMap, IChainItem} from "@/pc/services/contract";
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
import {bnToWei, ethToWei, gweiToWei, weiToEth, weiToGwei} from "@/pc/utils/eth";
import {heroesJson} from "@/pc/constant";
import {useLoading, useMount} from "@lib/react-hook";
import {useSnackbar} from "notistack";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import Provider from "@/pc/instance/provider";
import {LoadingButton} from '@mui/lab'
import {Modal} from "@lib/react-component";
import {useHeroAbi} from "@/pc/context/abi/hero";
import {useAuctionAbi} from "@/pc/context/abi/auction";
import {useContract} from "@/pc/context/contract";
import {useReferencePrice} from "@/pc/hook/gas";

const Hero: React.FC<{ list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {list, arrangement, loading} = props;
    const [contract] = useContract();
    const {data: contractMap} = contract
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {chainId, address} = wallet;
    const [heroesMap, setHeroesMap] = useState<{ [key: string]: string }>({});
    const [hero] = useHeroAbi()
    const {loading: heroAbiLoading, abi: heroAbi} = hero;
    const [auction] = useAuctionAbi()
    const {loading: auctionAbiLoading, abi: auctionAbi} = auction;
    const [onSaleVisible, setOnSaleVisible] = useState(false);
    const [onSaleSelected, setOnSaleSelected] = useState<IChainItem | undefined>(undefined)
    const [sendVisible, setSendVisible] = useState(false);
    const [sendSelected, setSendSelected] = useState<IChainItem | undefined>(undefined)
    const initMap = useCallback(() => {
        const map: { [key: string]: string } = {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    }, [])
    const auctionContractInstanceRef = useRef<ethers.Contract | null>();
    const heroContractInstanceRef = useRef<ethers.Contract | null>();
    const [connectLoading, setConnectLoading] = useState(true)
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, auctionAbi: ContractInterface, heroAbi: ContractInterface) => {
        setConnectLoading(true)
        const auctionAddress = contractMap[chainId]?.AuctionContractAddress;
        const heroAddress = contractMap[chainId]?.HeroContractAddress;
        const provider = await Provider.getInstance();
        if (provider) {
            let singer
            try {
                singer = provider.getSigner();
            } catch (e) {
                enqueueSnackbar("签名失败，请刷新页面", {variant: "error"})
                setConnectLoading(false)
            }

            if (auctionAddress) {
                const auctionContractInstance: ethers.Contract | null = new ethers.Contract(auctionAddress, auctionAbi, singer);
                auctionContractInstanceRef.current = auctionContractInstance
            }
            if (heroAddress) {
                const heroContractInstance: ethers.Contract | null = new ethers.Contract(heroAddress, heroAbi, singer);
                heroContractInstanceRef.current = heroContractInstance
            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])

    const saleFormRef = useRef<{ startingPrice: number, endingPrice: number, duration: number, gasLimit: number, gasPrice: number }>(null)
    const [onSaleIng, setOnSaleIng] = useState(false)
    const handleSale = useCallback(async () => {
        const auctionContract = auctionContractInstanceRef.current
        const heroContract = heroContractInstanceRef.current
        const saleForm = saleFormRef.current
        if (chainId && auctionContract && saleForm && heroContract) {
            const chain = contractMap[chainId]
            const {startingPrice, endingPrice, duration, gasLimit, gasPrice} = saleForm
            if (chain && onSaleSelected) {
                setOnSaleIng(true)
                const startingPriceWei = ethToWei(startingPrice.toString())
                const endingPriceWei = ethToWei(endingPrice.toString())
                const params = {
                    from: address,
                    gasPrice:gweiToWei(gasPrice.toString()), 
                    gasLimit
                }
                let hasRole = false
                try {
                    hasRole = await heroContract.isApprovedForAll(address, chain.AuctionContractAddress)
                } catch (e: any) {
                    enqueueSnackbar(`获取权限失败:${e.message}`, {variant: 'error'})
                    setOnSaleIng(false)
                    return
                }
                if (!hasRole) {
                    try {
                        await heroContract.setApprovalForAll(chain.AuctionContractAddress, true)
                    } catch (e: any) {
                        setOnSaleIng(false)
                        enqueueSnackbar(`授权失败:${e.message}`, {variant: 'error'})
                        return
                    }
                }

                try {
                    await auctionContract.createAuction(chain.HeroContractAddress, onSaleSelected.tokenId, startingPriceWei, endingPriceWei, duration, params);
                    enqueueSnackbar("上架成功,等待链上确认", {variant: 'success'});
                    setOnSaleSelected(undefined)
                    setOnSaleVisible(false)
                } catch (e: any) {
                    console.log(e)
                    setOnSaleIng(false)
                    enqueueSnackbar(`上架失败:${e.message}`, {variant: 'error'})
                    return
                }
                setOnSaleIng(false)
            } else {
                enqueueSnackbar("当前不支持", {variant: 'error'})
            }
        } else {
            enqueueSnackbar("请链接钱包", {variant: 'error'})
        }

    }, [address, chainId, contractMap, enqueueSnackbar, onSaleSelected])
    const sendFormRef = useRef<{ to: string, gasLimit: number, gasPrice: number }>(null)
    const [onSendIng, setOnSendIng] = useState(false);
    const handleSend = useCallback(async () => {
        const heroContract = heroContractInstanceRef.current
        const sendForm = sendFormRef.current
        if (chainId && heroContract && sendForm) {
            const chain = contractMap[chainId]
            const {gasLimit, gasPrice, to} = sendForm
            if (chain && sendSelected) {
                setOnSendIng(true)
                const params = {
                    from: address,
                    gasPrice:gweiToWei(gasPrice.toString()), 
                    gasLimit
                }
                try {
                    await heroContract['safeTransferFrom(address,address,uint256)'](address, to, sendSelected.tokenId, params);
                    enqueueSnackbar("发送成功,等待链上确认", {variant: 'success'});
                    setSendSelected(undefined)
                    setSendVisible(false)
                } catch (e: any) {
                    setOnSendIng(false)
                    enqueueSnackbar(`发送失败:${e.message}`, {variant: 'error'})
                }
                setOnSendIng(false)
            } else {
                enqueueSnackbar("当前不支持", {variant: 'error'})
            }
        } else {
            enqueueSnackbar("请链接钱包", {variant: 'error'})
        }
    }, [address, chainId, contractMap, enqueueSnackbar, sendSelected])
    const [saleReferenceLimit, setSaleReferenceLimit] = useState("");
    const guessSale = useCallback(async (address: string, AuctionContractAddress: string, HeroContractAddress: string, tokenId: string) => {
        const auctionContract = auctionContractInstanceRef.current
        const heroContract = heroContractInstanceRef.current
        if (heroContract && auctionContract) {
            let hasRole = false
            try {
                hasRole = await heroContract.isApprovedForAll(address, AuctionContractAddress)
            } catch (e: any) {
                return
            }
            if (!hasRole) {
                try {
                    await heroContract.setApprovalForAll(AuctionContractAddress, true)
                } catch (e: any) {
                    return
                }
            }
            // todo
            const startingPriceWei = ethToWei('0.01')
            const endingPriceWei = ethToWei('0.02')
            const res = await auctionContract.estimateGas.createAuction(HeroContractAddress, tokenId, startingPriceWei, endingPriceWei, 3600,{from:address});
            setSaleReferenceLimit(bnToWei(res.mul(5)))
        }
    }, [])
    useEffect(() => {
        if (address && contractMap && chainId && onSaleSelected) {
            const chain = contractMap[chainId]
            if (chain) {
                guessSale(address, chain.AuctionContractAddress, chain.HeroContractAddress, onSaleSelected.tokenId).then()
            }

        }
    }, [address, contractMap, chainId, onSaleSelected, guessSale])

    const [sendReferenceLimit, setSendReferenceLimit] = useState("");
    const guessSend = useCallback(async (address: string, tokenId: string) => {
        const heroContract = heroContractInstanceRef.current
        if (heroContract) {
            const res = await heroContract.estimateGas['safeTransferFrom(address,address,uint256)'](address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", tokenId);
            setSendReferenceLimit(bnToWei(res.mul(5)))
        }
    }, [])
    useEffect(() => {
        if (address && sendSelected) {
            guessSend(address, sendSelected.tokenId).then()

        }
    }, [address, guessSend, sendSelected])
    useMount(() => {
        initMap()
    })
    /**
     * 构建合同
     */
    useEffect(() => {
        if (chainId && auctionAbi && heroAbi) {
            connectContract(contractMap, chainId, auctionAbi, heroAbi).then()
        }
    }, [chainId, connectContract, contractMap, auctionAbi, heroAbi])
    const masonryItemRender = useCallback((item: IChainItem,) => {
        const image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        const name = heroesMap[item.tokenUri || '']
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const onSale = () => {
            setOnSaleVisible(true)
            setOnSaleSelected(item)
        }
        const onSend = () => {
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
                    data-value={item.currentPrice}
                    variant={"contained"}
                    size={"small"}
                    onClick={onSale}
                >
                    上架
                </LoadingButton>

                <LoadingButton
                    loading={connectLoading || auctionAbiLoading}
                    data-id={item.tokenId}
                    data-value={item.currentPrice}
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
        const onSale = () => {
            setOnSaleVisible(true)
            setOnSaleSelected(item)
        }
        const onSend = () => {
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
                        data-value={item.currentPrice}
                        variant={"contained"}
                        size={"small"}
                        onClick={onSale}
                    >
                        上架
                    </LoadingButton>

                    <LoadingButton
                        loading={connectLoading || auctionAbiLoading}
                        data-id={item.tokenId}
                        data-value={item.currentPrice}
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
    const handleOnSaleCancel = useCallback(() => {
        setOnSaleVisible(false);
        setOnSaleSelected(undefined)
    }, [])
    const handleSendCancel = useCallback(() => {
        setSendVisible(false);
        setSendSelected(undefined)
    }, [])
    const _loading = useMemo(() => {
        return auctionAbiLoading || loading || heroAbiLoading || connectLoading
    }, [auctionAbiLoading, connectLoading, heroAbiLoading, loading])
    return <Box>
        <Modal
            open={onSaleVisible}
            title={'上架'}
            onCancel={handleOnSaleCancel}
            onOk={handleSale}
            keepMounted={true}
            loading={onSaleIng}
        >
            <SaleFormRef name={heroesMap[onSaleSelected?.tokenUri || '']} ref={saleFormRef} referenceLimit={saleReferenceLimit}/>
        </Modal>
        <Modal
            open={sendVisible}
            title={'赠送'}
            onCancel={handleSendCancel}
            onOk={handleSend}
            keepMounted={true}
            loading={onSendIng}
        >
            <SendFormRef name={heroesMap[sendSelected?.tokenUri || '']} ref={sendFormRef} referenceLimit = {sendReferenceLimit}/>
        </Modal>
        <Divider sx={{marginBottom: 3}}/>
        {_loading ? <Box
            display={'flex'}
            width={'100%'}
            height={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
            minHeight={900}>
            <CircularProgress sx={{
                color: theme => theme.palette.text.primary
            }}/>
        </Box> : heroList}
    </Box>
}
export default Hero;
const SaleForm: ForwardRefRenderFunction<{ startingPrice: number, endingPrice: number, duration: number, gasLimit: number, gasPrice: number }, { name?: string, referenceLimit?: string }> = (props, ref) => {
    const {referenceLimit} = props
    const [startingPrice, setStartingPrice] = useState(0.1)
    const [endingPrice, setEndingPrice] = useState(0.2)
    const [duration, setDuration] = useState(3600)
    const [referencePrice] = useReferencePrice();
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    const _referenceLimit = useMemo(() => {
        return referenceLimit ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasLimit(Number.parseInt(referenceLimit))}>参考值:{referenceLimit}</Typography> : ''
    }, [referenceLimit])
    const _referenceGweiPrice = useMemo(()=>weiToGwei(referencePrice,'up'),[referencePrice])
    const _referencePrice = useMemo(() => {
        return _referenceGweiPrice ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasPrice(Number.parseInt(_referenceGweiPrice))}>参考值:{_referenceGweiPrice}</Typography> : ''
    }, [_referenceGweiPrice])
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
                helperText={<>单位:gwei {_referencePrice}</>}
            />
            <TextField
                label="gasLimit"
                type={"number"}
                value={gasLimit}
                onChange={handleGasLimitChange}
                helperText={<>{_referenceLimit}</>}
            />
        </Stack>

    </>
}
const SaleFormRef = React.forwardRef(SaleForm);

const SendForm: ForwardRefRenderFunction<{ to: string, gasLimit: number, gasPrice: number }, { name?: string, referenceLimit?: string  }> = (props, ref) => {
    const {referenceLimit} = props
    const [to, setTo] = useState("")
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    const [referencePrice] = useReferencePrice();
    const _referenceLimit = useMemo(() => {
        return referenceLimit ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasLimit(Number.parseInt(referenceLimit))}>参考值:{referenceLimit}</Typography> : ''
    }, [referenceLimit])
    const _referenceGweiPrice = useMemo(()=>weiToGwei(referencePrice,'up'),[referencePrice])
    const _referencePrice = useMemo(() => {
        return _referenceGweiPrice ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasPrice(Number.parseInt(_referenceGweiPrice))}>参考值:{_referenceGweiPrice}</Typography> : ''
    }, [_referenceGweiPrice])

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
    }), [to, gasLimit, gasPrice])
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
                helperText={<>单位:gwei {_referencePrice}</>}
            />
            <TextField
                label="gasLimit"
                type={"number"}
                value={gasLimit}
                onChange={handleGasLimitChange}
                helperText={<>{_referenceLimit}</>}
            />
        </Stack>

    </>
}
const SendFormRef = React.forwardRef(SendForm);
