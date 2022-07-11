import React, {
    ForwardRefRenderFunction,
    useCallback, useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import {IChainContractConfigMap} from "@/pc/services/contract";
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
import {ethToWei, weiToEth} from "@/pc/utils/eth";
import {useSnackbar} from "notistack";
import {ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import {Modal} from "@lib/react-component";
import {useContract} from "@/pc/context/contract";
import {useReferenceLimit, useReferencePrice} from "@/pc/hook/gas";

import {strToHex} from "@/pc/utils/hex";

interface IItem {
    name: string,
    currentPrice: string
    quality: string,
    to: string
    productID: string
    noticeType: number,
    result: number
}

const list: IItem[] = [
    {
        name: '门票',
        currentPrice: ethToWei('0.0001'),
        quality: '1',
        to: '0x279A4C36098c4e76182706511AB0346518ad6049',
        productID: '111001316',
        noticeType: 30,
        result: 2
    }
]
const Tickets: React.FC<{ arrangement: EArrangement }> = (props) => {
    const {arrangement} = props;
    const {enqueueSnackbar} = useSnackbar()
    const [contract] = useContract();
    const {data: contractMap, loading: loadChainLoading} = contract
    const [wallet] = useWallet();
    const {chainId, address} = wallet;
    const [visible, setVisible] = useState(false);
    const [buySelected, setBuySelected] = useState<IItem | undefined>(undefined)

    const buyFormRef = useRef<{ gasLimit: number, gasPrice: number }>(null)
    const [buying, setBuying] = useState(false)
    const handleBuy = useCallback(async () => {
        const buyForm = buyFormRef.current
        if (buyForm && buySelected) {
            setBuying(true)
            const {gasLimit, gasPrice} = buyForm

            const params = {
                from: address,
                gasPrice, gasLimit,
                value: ethers.utils.parseUnits(buySelected.currentPrice, 'wei'),
            }
            try {
                enqueueSnackbar("购买成功，等待上链", {variant: "success"})
                setBuying(false)
                setVisible(false)
                setBuySelected(undefined)
            } catch (e: any) {
                setBuying(false)
                enqueueSnackbar(`购买失败:${e.message}`, {variant: 'error'})
            }

        }
    }, [address, buySelected, enqueueSnackbar])
    const handleCancel = useCallback(() => {
        setVisible(false)
        setBuySelected(undefined)
    }, [])

    const masonryItemRender = useCallback((item: IItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const buy = () => {
            if(chainId){
                const chain = contractMap[chainId]
                if(chain){
                    setVisible(true)
                    setBuySelected(item)
                }else{
                    enqueueSnackbar("当前链不支持",{variant:"error"})
                }
            }else{
                enqueueSnackbar("正在获取配置，请稍后")
            }
        }
        return <CustomCard
            key={`${item.to}`}
            elevation={0}
            variant="outlined"
        >
            <Box
                component="img"
                alt="The house from the offer."
                src={"http://172.24.135.32:3080/static/img/mintBox.jpg"}
                width={'100%'}

            />
            <CardContent>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography gutterBottom variant="h6" component="div">
                        门票
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {weiToEth(item.currentPrice)} eth
                    </Typography>
                </Stack>

                <Rating name="read-only" value={rate} readOnly/>
            </CardContent>
            <CardActions>
                <LoadingButton
                    loading={buying || loadChainLoading}
                    variant={"contained"}
                    size={"small"}
                    onClick={buy}>购买</LoadingButton>
            </CardActions>
        </CustomCard>
    }, [buying, chainId, contractMap, enqueueSnackbar, loadChainLoading])
    const gridItemRender = useCallback((item: IItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        const buy = () => {
            if(chainId){
                const chain = contractMap[chainId]
                if(chain){
                    setVisible(true)
                    setBuySelected(item)
                }else{
                    enqueueSnackbar("当前链不支持",{variant:"error"})
                }
            }else{
                enqueueSnackbar("正在获取配置，请稍后")
            }
        }
        return <Grid item={true} key={`${item.to}`} xs={12}
                     sm={4} md={3}>
            <CustomCard elevation={0} variant={'outlined'}>
                <CardMedia
                    component="img"
                    alt="green iguana"
                    image={"http://172.24.135.32:3080/static/img/mintBox.jpg"}
                />
                <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography gutterBottom variant="h6" component="div">
                            门票
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
                        loading={buying || loadChainLoading}
                    >购买</LoadingButton>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [buying, chainId, contractMap, enqueueSnackbar, loadChainLoading])
    const ticketsList = useMemo(() => {
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
    }, [arrangement, gridItemRender, masonryItemRender])
    return <>
        <Modal
            open={visible}
            title={'购买'}
            onOk={handleBuy}
            onCancel={handleCancel}
            loading={buying}
        >
            <BuyFormRef ref={buyFormRef} item={buySelected} from={address} chainId={chainId}/>
        </Modal>
        <Box marginTop={3}>
            {ticketsList}
        </Box></>
}
export default Tickets;
const BuyForm: ForwardRefRenderFunction<{ gasLimit: number, gasPrice: number }, { item?:IItem,from?:string,chainId?:string }> = (props, ref) => {
    const {item,from,chainId} = props;
    const [referencePrice] = useReferencePrice();
    const [referenceLimit,,guess] = useReferenceLimit();
    const [gasPrice, setGasPrice] = useState(20)
    const [gasLimit, setGasLimit] = useState(21000)
    useEffect(()=>{
        if(item&&from&&chainId){
            console.log(item,from)
            guess({
                to: item.to,
                from: from,
                data:strToHex(JSON.stringify(item)),
                value: strToHex(weiToEth(item.currentPrice)),
                chainId:Number.parseInt(chainId)
            }).then()
        }
    },[chainId, from, guess, item])
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
