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
    Grid,
    Rating,
    Stack, TextField,
    Typography
} from "@mui/material";
import {Masonry} from "@mui/lab";
import {bnToWei, weiToEth} from "@/pc/utils/eth";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab"
import {Modal} from "@lib/react-component/lib/modal";
import {ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import Provider from "@/pc/instance/provider";
import {usePreSaleAbi} from "@/pc/context/abi/preSale";
import {useContract} from "@/pc/context/contract";
import {useReferencePrice} from "@/pc/hook/gas";

const getButtonText = (startTime?: string, endTime?: string,isSupported?:boolean) => {
    if(isSupported){
        return {text: '已参加', disabled: true}
    }
    if (!startTime || !endTime) {
        return {text: '尚未开始', disabled: true}
    }
    const current = new Date()
    const currentSecond = current.getTime() / 1000
    const start = Number.parseInt(startTime)
    const end = Number.parseInt(endTime)
    if (currentSecond < start) {
        return {text: '尚未开始', disabled: true}
    } else if (currentSecond > start && currentSecond < end) {
        return {text: '火热进行中', disabled: false}
    } else {
        return {text: '已结束', disabled: true}
    }
}
const PreSale: React.FC<{ contractMap: IChainContractConfigMap, list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {list, arrangement, loading} = props;
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {chainId,address} = wallet;
    const buyFormRef = useRef<{ gasLimit: number, gasPrice: number }>(null)
    const [visible,setVisible] = useState(false);
    const preSaleContractInstanceRef = useRef<ethers.Contract | null>();
    const [buySelected, setBuySelected] = useState<IChainItem | undefined>(undefined)
    const [buying,setBuying] =useState(false)
    const [preSale] = usePreSaleAbi()
    const [contract] = useContract();
    const {data: contractMap} = contract
    const {abi: preSaleAbi, loading: abiLoading} = preSale
    const [connectLoading, setConnectLoading] = useState(true)
    const [isSupported,setIsSupported] = useState(false);
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, preSaleAbi: ContractInterface) => {
        setConnectLoading(true)
        const preSaleAddress = contractMap[chainId]?.PreSaleContractAddress;
        const provider = await Provider.getInstance();
        if (provider) {
            let singer
            try {
                singer = provider.getSigner();
            } catch (e) {
                enqueueSnackbar("签名失败，请刷新页面", {variant: "error"})
                setConnectLoading(false)
            }

            if (preSaleAddress) {
                const preSaleContractInstance: ethers.Contract | null = new ethers.Contract(preSaleAddress, preSaleAbi, singer);
                preSaleContractInstanceRef.current = preSaleContractInstance
                try {
                    const bool = await preSaleContractInstance.IsSupported(address);
                    setIsSupported(bool)
                }catch (e) {
                    enqueueSnackbar("获取信息失败，请刷新",{variant:"error"})
                    setConnectLoading(false)
                }

            }
        }
        setConnectLoading(false)
    }, [address, enqueueSnackbar])
    const [referenceLimit,setReferenceLimit] = useState("");
    const guess = useCallback(async (currentPrice:string)=>{
        const preSaleContractInstance =  preSaleContractInstanceRef.current
        if(preSaleContractInstance){
            const params = {
                value:ethers.utils.parseUnits(currentPrice,'wei'),
            }
            const res = await preSaleContractInstance.estimateGas.Support(params)
            setReferenceLimit(bnToWei(res))
        }
    },[])
    useEffect(()=>{
        if(buySelected){
            guess(buySelected.currentPrice).then()
        }
    },[buySelected, guess])
    const handleBuy = useCallback(async () => {
        const preSaleContractInstance = preSaleContractInstanceRef.current
        const buyForm = buyFormRef.current
        if(preSaleContractInstance&&buyForm&&buySelected){
            setBuying(true)
            const {gasLimit,gasPrice} = buyForm

            const params = {
                from: address,
                gasPrice, gasLimit,
                value:ethers.utils.parseUnits(buySelected.currentPrice,'wei'),
            }
            try {
                await preSaleContractInstance.Support(params);
                enqueueSnackbar("购买成功，等待上链",{variant:"success"})
                setBuying(false)
                setVisible(false)
                setBuySelected(undefined)
            }catch (e:any) {
                setBuying(false)
                enqueueSnackbar(`购买失败:${e.message}`,{variant: 'error'})
            }

        }
    }, [address, buySelected, enqueueSnackbar])
    const handleCancel = useCallback(()=>{
       setVisible(false)
       setBuySelected(undefined)
    },[])
    /**
     * 构建合同
     */
    useEffect(() => {
        if (chainId && preSaleAbi) {
            connectContract(contractMap, chainId, preSaleAbi).then()
        }
    }, [chainId, connectContract, contractMap, preSaleAbi])
    const masonryItemRender = useCallback((item: IChainItem,) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const {text, disabled} = getButtonText(item.preSale?.startTime, item.preSale?.endTime,isSupported)
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
                src={"http://172.24.135.32:3080/static/img/preSale.jpg"}
                width={'100%'}

            />
            <CardContent>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography gutterBottom variant="h6" component="div">
                        预售
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
                    disabled={disabled}
                    loading={abiLoading||connectLoading}
                    onClick={buy}
                >{text}</LoadingButton>
            </CardActions>
        </CustomCard>
    }, [abiLoading, connectLoading, isSupported])

    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const {text, disabled} = getButtonText(item.preSale?.startTime, item.preSale?.endTime,isSupported)
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
                    image={"http://172.24.135.32:3080/static/img/preSale.jpg"}
                />
                <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography gutterBottom variant="h6" component="div">
                            预售
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
                        loading={abiLoading||connectLoading}
                        disabled={disabled}
                    >{text}</LoadingButton>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [abiLoading, connectLoading, isSupported])
    const mintBoxList = useMemo(() => {
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
    return <>
        <Modal
            open={visible}
            title={'购买预售'}
            onOk={handleBuy}
            onCancel={handleCancel}
            loading={buying}
        >
            <BuyFormRef ref={buyFormRef} referenceLimit={referenceLimit}/>
        </Modal>
        <Box marginTop={3}>
            {mintBoxList}
        </Box>
    </>
}
export default PreSale;
const BuyForm: ForwardRefRenderFunction<{ gasLimit: number, gasPrice: number }, { referenceLimit?:string }> = (props, ref) => {
    const {referenceLimit} = props
    const [referencePrice] = useReferencePrice();
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    const _referenceLimit = useMemo(()=>{
        return referenceLimit?<Typography display={"inline-block"} fontSize={'inherit'} component={'span'} onClick={()=>setGasLimit(Number.parseInt(referenceLimit))}>参考值:{referenceLimit}</Typography>:''
    },[referenceLimit])
    const _referencePrice = useMemo(()=>{
        return referencePrice?<Typography display={"inline-block"} fontSize={'inherit'} component={'span'} onClick={()=>setGasPrice(Number.parseInt(referencePrice))}>参考值:{referencePrice}</Typography>:''
    },[referencePrice])
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
                helperText={<>单位:wei  {_referencePrice}</>}
            />
            <TextField
                label="gasLimit"
                type={"number"}
                value={gasLimit}
                onChange={handleGasLimitChange}
                helperText={<>单位：wei {_referenceLimit}</>}
            />
        </Stack>

    </>
}
const BuyFormRef = React.forwardRef(BuyForm);
