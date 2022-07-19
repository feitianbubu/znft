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
import {Masonry, LoadingButton} from "@mui/lab";
import {bnToWei, gweiToWei, weiToEth, weiToGwei} from "@/pc/utils/eth";
import {useSnackbar} from "notistack";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import Provider from "@/pc/instance/provider";
import {ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import {useMintBoxAbi} from "@/pc/context/abi/mint";
import {useContract} from "@/pc/context/contract";
import {Modal} from "@lib/react-component";
import {useReferencePrice} from "@/pc/hook/gas";

const MintBox: React.FC<{ contractMap: IChainContractConfigMap, list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {list, arrangement, loading} = props;
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {chainId,address} = wallet;
    const [contract] = useContract();
    const {data: contractMap} = contract
    const [mintBox] = useMintBoxAbi()
    const {abi: mintBoxAbi, loading: abiLoading} = mintBox
    const [connectLoading, setConnectLoading] = useState(true)
    const mintBoxContractInstanceRef = useRef<ethers.Contract | null>();
    const [visible,setVisible] = useState(false);
    const [buySelected, setBuySelected] = useState<IChainItem | undefined>(undefined)
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, mintBoxAbi: ContractInterface) => {
        setConnectLoading(true)
        const mintBoxAddress = contractMap[chainId]?.MintBoxContractAddress;
        const provider = await Provider.getInstance();
        if (provider) {
            let singer
            try {
                singer = provider.getSigner();
            } catch (e) {
                enqueueSnackbar("签名失败，请刷新页面", {variant: "error"})
                setConnectLoading(false)
            }

            if (mintBoxAddress) {
                const mintBoxContractInstance: ethers.Contract | null = new ethers.Contract(mintBoxAddress, mintBoxAbi, singer);
                mintBoxContractInstanceRef.current = mintBoxContractInstance
            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])
    const [referenceLimit,setReferenceLimit] = useState("");
    const guess = useCallback(async (currentPrice:string)=>{
        const mintBoxContractInstance =  mintBoxContractInstanceRef.current
        if(mintBoxContractInstance){
            const params = {
                value:ethers.utils.parseUnits(currentPrice,'wei'),
            }
            const res = await mintBoxContractInstance.estimateGas.mintBox(params)
            setReferenceLimit(bnToWei(res.mul(5)))
        }
    },[])
    useEffect(()=>{
        if(buySelected){
            guess(buySelected.currentPrice).then()
        }
    },[buySelected, guess])
    /**
     * 构建合同
     */
    useEffect(() => {
        if (chainId && mintBoxAbi) {
            connectContract(contractMap, chainId, mintBoxAbi).then()
        }
    }, [chainId, connectContract, contractMap, mintBoxAbi])
    const buyFormRef = useRef<{ gasLimit: number, gasPrice: number }>(null)
    const [buying,setBuying] =useState(false)
    const handleBuy = useCallback(async ()=>{
        const mintBoxContractInstance = mintBoxContractInstanceRef.current
        const buyForm = buyFormRef.current
        if(mintBoxContractInstance&&buyForm&&buySelected){
            setBuying(true)
            const {gasLimit,gasPrice} = buyForm

            const params = {
                from: address,
                gasPrice:gweiToWei(gasPrice.toString()), gasLimit,
                value:ethers.utils.parseUnits(buySelected.currentPrice,'wei'),
            }
            try {
                await mintBoxContractInstance.mintBox(params);
                enqueueSnackbar("购买成功，等待上链",{variant:"success"})
                setBuying(false)
                setVisible(false)
                setBuySelected(undefined)
            }catch (e:any) {
                setBuying(false)
                enqueueSnackbar(`购买失败:${e.message}`,{variant: 'error'})
            }

        }
    },[address, buySelected, enqueueSnackbar])
    const handleCancel = useCallback(()=>{
        setVisible(false)
        setBuySelected(undefined)
    },[])

    const masonryItemRender = useCallback((item: IChainItem,) => {
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
                alt="mint box"
                src={"/web/images/mintBox.jpg"}
                width={'100%'}

            />
            <CardContent>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography gutterBottom variant="h6" component="div">
                        盲盒
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {weiToEth(item.currentPrice)} eth
                    </Typography>
                </Stack>

                <Rating name="read-only" value={rate} readOnly/>
            </CardContent>
            <CardActions>
                <LoadingButton
                    loading={abiLoading || connectLoading||buying}
                    variant={"contained"}
                    size={"small"}
                    onClick={buy}>购买</LoadingButton>
            </CardActions>
        </CustomCard>
    }, [abiLoading, buying, connectLoading])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const buy = ()=>{
            setVisible(true)
            setBuySelected(item)
        }
        return <Grid item={true} key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`} xs={12}
                     sm={4} md={3}>
            <CustomCard elevation={0} variant={'outlined'}>
                <CardMedia
                    component="img"
                    alt="mint box"
                    image={"/web/images/mintBox.jpg"}
                />
                <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography gutterBottom variant="h6" component="div">
                            盲盒
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
                        loading={abiLoading || connectLoading||buying}
                    >购买</LoadingButton>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [abiLoading, buying, connectLoading])
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
            title={'购买盲盒'}
            onOk={handleBuy}
            onCancel={handleCancel}
            loading={buying}
        >
            <BuyFormRef ref={buyFormRef} referenceLimit={referenceLimit}/>
        </Modal>
        <Box marginTop={3}>
            {mintBoxList}
        </Box></>
}
export default MintBox;
const BuyForm: ForwardRefRenderFunction<{ gasLimit: number, gasPrice: number }, { referenceLimit?:string }> = (props, ref) => {
    const {referenceLimit} = props
    const [referencePrice] = useReferencePrice();
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    const _referenceLimit = useMemo(()=>{
        return referenceLimit?<Typography display={"inline-block"} fontSize={'inherit'} component={'span'} onClick={()=>setGasLimit(Number.parseInt(referenceLimit))}>参考值:{referenceLimit}</Typography>:''
    },[referenceLimit])
    const _referenceGweiPrice = useMemo(()=>weiToGwei(referencePrice,'up'),[referencePrice])
    const _referencePrice = useMemo(() => {
        return _referenceGweiPrice ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasPrice(Number.parseInt(_referenceGweiPrice))}>参考值:{_referenceGweiPrice}</Typography> : ''
    }, [_referenceGweiPrice])
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
                helperText={<>单位:gwei  {_referencePrice}</>}
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
const BuyFormRef = React.forwardRef(BuyForm);
