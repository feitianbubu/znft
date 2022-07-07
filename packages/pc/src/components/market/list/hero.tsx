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
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Rating,
    Stack, TextField,
    Typography
} from "@mui/material";
import {Masonry} from "@mui/lab";
import {weiToEth} from "@/pc/utils/eth";
import {heroesJson} from "@/pc/constant";
import {useMount} from "@lib/react-hook";
import {useSnackbar} from "notistack";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import Provider from "@/pc/instance/provider";
import {LoadingButton} from '@mui/lab'
import {useHeroAbi} from "@/pc/context/abi/hero";
import {useAuctionAbi} from "@/pc/context/abi/auction";
import {Modal} from "@lib/react-component/lib/modal";

const Hero: React.FC<{ contractMap: IChainContractConfigMap, list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {contractMap, list, arrangement, loading} = props;
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {chainId, address} = wallet;
    const [heroesMap, setHeroesMap] = useState<{ [key: string]: string }>({});
    const [visible,setVisible] = useState(false);
    const [buySelected, setBuySelected] = useState<IChainItem | undefined>(undefined)
    const initMap = useCallback(() => {
        const map: { [key: string]: string } = {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    }, [])

    const [hero] = useHeroAbi()
    const {loading:heroAbiLoading,abi:heroAbi} = hero;
    const [auction] = useAuctionAbi()
    const {loading:auctionAbiLoading,abi:auctionAbi} = auction;
    const auctionContractInstanceRef = useRef<ethers.Contract | null>();
    const [connectLoading, setConnectLoading] = useState(false)
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, auctionAbi:ContractInterface) => {
        setConnectLoading(true)
        const auctionAddress = contractMap[chainId]?.AuctionContractAddress;
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
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])
    const [buying,setBuying] =useState(false)
    const buyFormRef = useRef<{ gasLimit: number, gasPrice: number }>(null)
    const handleBuy = useCallback(async () => {
        const contractInstance = auctionContractInstanceRef.current;
        if (chainId) {
            const chain = contractMap[chainId]
            const {HeroContractAddress} = chain || {}
            const buyForm = buyFormRef.current
            if (contractInstance && HeroContractAddress&&address&&buySelected&&buyForm) {
                setBuying(true)
                const {gasPrice,gasLimit } = buyForm
                const params = {
                    gasLimit,
                    gasPrice,
                    value:ethers.utils.parseUnits(buySelected.currentPrice,'wei'),
                    from:address,
                }
                try {
                     await contractInstance.bid(HeroContractAddress, buySelected.tokenId,params)
                    enqueueSnackbar("已发起购买，请等待交易成功")
                    setBuying(false)
                    setVisible(false)
                    setBuySelected(undefined)
                }
                catch (e:any) {
                    enqueueSnackbar(`购买失败:${e.message}`,{variant: 'error'})
                    setBuying(false)
                }
            }
        }

    }, [address, buySelected, chainId, contractMap, enqueueSnackbar])
    const handleCancel= useCallback(()=>{
        setVisible(false);
        setBuySelected(undefined)
    },[])
    useMount(() => {
        initMap()
    })
    /**
     * 构建合同
     */
    useEffect(() => {
        if (chainId && auctionAbi) {
            connectContract(contractMap, chainId, auctionAbi).then()
        }
    }, [auctionAbi, chainId, connectContract, contractMap])
    const masonryItemRender = useCallback((item: IChainItem,) => {
        const image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        const name = heroesMap[item.tokenUri || '']
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const buy = ()=>{
            setVisible(true)
            setBuySelected(item)
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
                    loading={connectLoading || auctionAbiLoading||heroAbiLoading||buying}
                    data-id={item.tokenId}
                    data-value = {item.currentPrice}
                    variant={"contained"}
                    size={"small"}
                    onClick={buy}
                >
                    购买
                </LoadingButton>
            </CardActions>
        </CustomCard>
    }, [heroesMap, connectLoading, auctionAbiLoading, heroAbiLoading, buying])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        const name = heroesMap[item.tokenUri || '']
        const buy = ()=>{
            setVisible(true)
            setBuySelected(item)
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
                        variant={"contained"}
                        size={"small"}
                        onClick={buy}

                        loading={connectLoading || auctionAbiLoading||heroAbiLoading||buying}
                        data-id={item.tokenId}
                        data-value = {item.currentPrice}
                    >购买</LoadingButton>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [heroesMap, connectLoading, auctionAbiLoading, heroAbiLoading, buying])
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
    return <Box>
        <Modal
            open={visible}
            title={'购买英雄'}
            onOk={handleBuy}
            onCancel={handleCancel}
            loading={buying}
        >
            <BuyFormRef ref={buyFormRef}/>
        </Modal>
        <Divider sx={{marginBottom: 3}}/>
        {heroList}
    </Box>
}
export default Hero;
const BuyForm: ForwardRefRenderFunction<{ gasLimit: number, gasPrice: number }, unknown> = (_props, ref) => {
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    const handleGasPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setGasPrice(isNaN(_value) ? 20 : _value)
    }, [])
    const handleGasLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setGasLimit(isNaN(_value) ? 21000 : _value)
    }, [])
    useImperativeHandle(ref, () => ({
        gasPrice,
        gasLimit
    }), [gasLimit, gasPrice])
    return <>
        <Stack direction={"column"} spacing={3} marginTop={3}>
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
const BuyFormRef = React.forwardRef(BuyForm);
