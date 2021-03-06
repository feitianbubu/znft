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
    CardMedia,
    Grid,
    Rating,
    Stack, TextField,
    Typography
} from "@mui/material";
import {Masonry,LoadingButton} from "@mui/lab";
import {bnToWei, gweiToWei, weiToEth, weiToGwei} from "@/pc/utils/eth";
import {useSnackbar} from "notistack";
import {Modal} from "@lib/react-component/lib/modal";
import {useMintBoxAbi} from "@/pc/context/abi/mint";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import Provider from "@/pc/instance/provider";
import {ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import {useContract} from "@/pc/context/contract";
import {useReferencePrice} from "@/pc/hook/gas";

const MintBox: React.FC<{ list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {list, arrangement, loading} = props;
    const [wallet] = useWallet();
    const {chainId, address} = wallet;
    const [contract] = useContract();
    const {data:contractMap} = contract
    const {enqueueSnackbar} = useSnackbar()
    const [mintBox] = useMintBoxAbi()
    const {abi:mintBoxAbi,loading:abiLoading} = mintBox
    const [openVisible, setOpenVisible] = useState(false);
    const [openSelected, setOpenSelected] = useState<IChainItem | undefined>(undefined)
    const [connectLoading, setConnectLoading] = useState(true)
    const mintBoxContractInstanceRef =  useRef<ethers.Contract | null>();
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, mintBoxAbi: ContractInterface) => {
        setConnectLoading(true)
        const mintBoxAddress = contractMap[chainId]?.MintBoxContractAddress;
        const provider = await Provider.getInstance();
        if (provider) {
            let singer
            try {
                singer = provider.getSigner();
            } catch (e) {
                enqueueSnackbar("??????????????????????????????", {variant: "error"})
                setConnectLoading(false)
            }

            if (mintBoxAddress) {
                const mintBoxContractInstance: ethers.Contract | null = new ethers.Contract(mintBoxAddress, mintBoxAbi, singer);
                mintBoxContractInstanceRef.current = mintBoxContractInstance
            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])
    const openFormRef = useRef<{ gasLimit: number, gasPrice: number }>(null)
    const [openIng,setOpenIng] = useState(false);
    const handleOpen= useCallback(async ()=>{
        const mintBoxContract = mintBoxContractInstanceRef.current
        const openForm = openFormRef.current
        if (chainId && mintBoxContract && openForm) {
            const chain = contractMap[chainId]
            const { gasLimit, gasPrice} = openForm
            if (chain && openSelected) {
                setOpenIng(true)
                const params = {
                    from: address,
                    gasPrice:gweiToWei(gasPrice.toString()),
                    gasLimit
                }
                try {
                    const res  = await mintBoxContract.usageBox(openSelected.tokenId, params);
                    console.log(res)
                    enqueueSnackbar("????????????,??????????????????", {variant: 'success'});
                    setOpenSelected(undefined)
                    setOpenVisible(false)
                } catch (e: any) {
                    console.log(e)
                    setOpenIng(false)
                    enqueueSnackbar(`????????????:${e.message}`, {variant: 'error'})
                    return
                }
                setOpenIng(false)
            } else {
                enqueueSnackbar("???????????????", {variant: 'error'})
            }
        } else {
            enqueueSnackbar("???????????????", {variant: 'error'})
        }
    },[address, chainId, contractMap, enqueueSnackbar, openSelected])
    const handleOpenCancel = useCallback(()=>{
        setOpenVisible(false)
    },[])

    const [referenceLimit,setReferenceLimit] = useState("");
    const guess = useCallback(async (tokenId:string)=>{
        const mintBoxContractInstance =  mintBoxContractInstanceRef.current
        if(mintBoxContractInstance){
            const res = await mintBoxContractInstance.estimateGas.usageBox(tokenId)
            setReferenceLimit(bnToWei(res.mul(5)))
        }
    },[])
    useEffect(()=>{
        if(openSelected){
            guess(openSelected.tokenId).then()
        }
    },[openSelected, guess])
    /**
     * ????????????
     */
    useEffect(() => {
        if (chainId && mintBoxAbi) {
            connectContract(contractMap, chainId, mintBoxAbi).then()
        }
    }, [chainId, connectContract, contractMap, mintBoxAbi])
    const masonryItemRender = useCallback((item: IChainItem,) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const open = () => {
            setOpenVisible(true)
            setOpenSelected(item)
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
                        ??????{item.tokenId}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {weiToEth(item.currentPrice)} eth
                    </Typography>
                </Stack>

                <Rating name="read-only" value={rate} readOnly/>
            </CardContent>
            <CardActions>
                <LoadingButton loading={abiLoading||connectLoading} variant={"contained"} size={"small"} onClick={open}>??????</LoadingButton>
            </CardActions>
        </CustomCard>
    }, [abiLoading, connectLoading])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const open = () => {
            setOpenVisible(true)
            setOpenSelected(item)
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
                        ??????{item.tokenId}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {weiToEth(item.currentPrice)} eth
                        </Typography>
                    </Stack>

                    <Rating name="read-only" value={rate} readOnly/>
                </CardContent>
                <CardActions>
                    <LoadingButton
                        loading={abiLoading||connectLoading}
                        variant={"contained"}
                        size={"small"}
                        onClick={open}
                    >??????</LoadingButton>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [abiLoading, connectLoading])
    const mintBoxList = useMemo(() => {
        if (loading) {
            return;
        }
        if (list.length == 0) {
            return <Box minHeight={160} display={"flex"} alignItems={"center"} justifyContent={"center"}><Typography
                color={theme => theme.palette.text.primary} variant={'h6'} textAlign={"center"}>
                ????????????
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
            open={openVisible}
            title={'??????'}
            onCancel={handleOpenCancel}
            onOk={handleOpen}
            keepMounted={true}
            loading={openIng}
        >
            <OpenFormRef ref={openFormRef} referenceLimit={referenceLimit}/>
        </Modal>
        <Box marginTop={3}>
            {mintBoxList}
        </Box>
    </>
}
export default MintBox;
const OpenForm: ForwardRefRenderFunction<{ gasLimit: number, gasPrice: number }, { referenceLimit?: string }> = (props, ref) => {
    const {referenceLimit} = props
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    const [referencePrice] = useReferencePrice();
    const _referenceLimit = useMemo(() => {
        return referenceLimit ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasLimit(Number.parseInt(referenceLimit))}>?????????:{referenceLimit}</Typography> : ''
    }, [referenceLimit])
    const _referenceGweiPrice = useMemo(()=>weiToGwei(referencePrice,'up'),[referencePrice])
    const _referencePrice = useMemo(() => {
        return _referenceGweiPrice ? <Typography display={"inline-block"} fontSize={'inherit'} component={'span'}
                                            onClick={() => setGasPrice(Number.parseInt(_referenceGweiPrice))}>?????????:{_referenceGweiPrice}</Typography> : ''
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
                helperText={<>??????:gwei {_referencePrice}</>}
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
const OpenFormRef = React.forwardRef(OpenForm);
