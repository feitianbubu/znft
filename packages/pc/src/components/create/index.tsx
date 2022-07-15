import React, {
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import {
    Box,
    Card,
    CircularProgress,
    Grid,
    Typography,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    TextField, Stack
} from "@mui/material";
import Provider from "@/pc/instance/provider";
import {Modal} from "@lib/react-component";
import {useWallet} from "@/pc/context/wallet";
import { IChainContractConfigMap} from "@/pc/services/contract";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {ethers} from "ethers";
import {useSnackbar} from "notistack";
import {heroesJson} from "@/pc/constant";
import {useContract} from "@/pc/context/contract";
import {useHeroAbi} from "@/pc/context/abi/hero";
import {useReferencePrice} from "@/pc/hook/gas";
import {bnToWei, gweiToWei, weiToGwei} from "@/pc/utils/eth";

const CREATE_ROLE = "0x154c00819833dac601ee5ddded6fda79d9d8b506b911b3dbd54cdb95fe6c3686"
// todo 暂时叫这个
const HERO_TYPE = "1"
const Create: React.FC = () => {
    const [wallet] = useWallet();
    const {enqueueSnackbar} = useSnackbar();
    const {address, chainId} = wallet;
    const [hasAuth, setHasAuth] = useState<undefined | boolean>(undefined);
    const [selected, setSelected] = useState<undefined | { bsID: number, name: string }>(undefined)
    const [visible, setVisible] = useState(false);
    const [contract] = useContract();
    const {data:contractMap,loading:loadChainLoading} = contract
    const [hero] = useHeroAbi()
    const {loading:heroAbiLoading,abi:heroAbi} = hero
    const [connectLoading, setConnectLoading] = useState(true)
    const heroContractInstanceRef = useRef<ethers.Contract | null>();
    const connectContract = useCallback(async (contractMap: IChainContractConfigMap, chainId: string, heroAbi: ContractInterface, address: string) => {
        setConnectLoading(true)
        const heroContractAddress = contractMap[chainId]?.HeroContractAddress;
        const provider = await Provider.getInstance();
        if (provider) {
            let singer
            try {
                singer = provider.getSigner();
            } catch (e) {
                enqueueSnackbar("签名失败，请刷新页面", {variant: "error"})
                setConnectLoading(false)
            }
            if (heroContractAddress) {
                const heroContractInstance: ethers.Contract | null = new ethers.Contract(heroContractAddress, heroAbi, singer);
                heroContractInstanceRef.current = heroContractInstance
                let bool = false
                try {
                    bool = await heroContractInstance.hasRole(CREATE_ROLE, address);
                }catch (e:any) {
                    setHasAuth(false)
                    setConnectLoading(false)
                }

                setHasAuth(bool)
                setConnectLoading(false)
            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])
    const handleClickCreate = useCallback((item: { bsID: number; name: string; }) => {
        setSelected(item);
        setVisible(true);
    }, [])
    const [referenceLimit,setReferenceLimit] = useState("");
    const handleCreate = useCallback(async () => {
        const form = ref.current
        const heroContract = heroContractInstanceRef.current;
        if (address && heroContract) {
            setCreateIng(true)
            if (form && selected) {
                const {gasPrice,gasLimit } = form
                console.log(gasPrice,gasPrice.toString())
                const params = {
                    from: address,
                    gasPrice:gweiToWei(gasPrice.toString()), 
                    gasLimit,
                }
                console.log(params)
                try {
                    await heroContract.mint(address,HERO_TYPE,selected.bsID.toString(),params)
                    enqueueSnackbar("铸造成功，等待上链",{variant:'success'})
                    setVisible(false);
                    setSelected(undefined)
                    setCreateIng(false)
                }catch (e) {
                    enqueueSnackbar("失败，请重试", {variant: "error"})
                    setCreateIng(false)
                    return
                }

            }
        } else {
            enqueueSnackbar("请链接钱包", {variant: "error"})
        }

    }, [address, enqueueSnackbar, selected])
    const guess = useCallback(async (address:string,bsID:string)=>{
        const heroContract = heroContractInstanceRef.current;
        if(heroContract){
            const res = await heroContract.estimateGas.mint(address,HERO_TYPE,bsID)
            setReferenceLimit(bnToWei(res))
        }
    },[])
    useEffect(()=>{
        if(selected&&address){
            guess(address,selected.bsID.toString()).then()
        }
    },[selected, address, guess])
    /**
     * 监听返回值 等这三个都有值了，就去请求权限
     */
    useEffect(() => {
        if (chainId && heroAbi && address) {
            connectContract(contractMap, chainId, heroAbi, address).then()
        }

    }, [chainId, connectContract, contractMap, heroAbi, address])
    const loading = useMemo(() => {
        return heroAbiLoading || loadChainLoading || connectLoading
    }, [connectLoading, heroAbiLoading, loadChainLoading])
    const list = useMemo(() => {
        return <Grid container={true} spacing={3} marginTop={3}>
            {heroesJson.map((item) => {
                const click = () => {
                    handleClickCreate(item)
                }
                const image = item.bsID?`https://img7.99.com/yhkd/image/data/hero//big-head/${item.bsID}.jpg`: 'http://172.24.135.32:3080/static/img/empty.jpg'
                return <Grid key={item.bsID} item={true} xs={2}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={image}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {item.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={click} variant={"contained"}>铸造</Button>
                        </CardActions>
                    </Card>
                </Grid>
            })}
        </Grid>
    }, [handleClickCreate])
    const child = useMemo(() => {
        return loading ?
            <Box display={'flex'} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}
                 minHeight={900}>
                <CircularProgress sx={{
                    color: theme => theme.palette.text.primary
                }}/>
            </Box> : hasAuth == false ?
                <Box display={'flex'} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}
                     minHeight={900}>
                    <Typography color={theme => theme.palette.text.primary} variant={'h3'} fontWeight={"bold"}
                                textAlign={'center'}>
                        403
                    </Typography>
                </Box> : <Box width={'100%'} height={'100%'}>{list}</Box>
    }, [hasAuth, list, loading])
    const handleCancel = useCallback(() => {
        setSelected(undefined);
        setVisible(false)
    }, [])
    const ref = useRef<{ currHp: number, level: number, power: number, quantity: number ,gasLimit:number,gasPrice:number}>(null)
    const [createIng,setCreateIng] = useState(false);


    return <>
        <Modal
            open={visible}
            title={'铸造'}
            onCancel={handleCancel}
            onOk={handleCreate}
            keepMounted={true}
            loading={createIng}
        >
            <FormRef name={selected?.name} ref={ref} referenceLimit={referenceLimit}/>
        </Modal>
        <Box minHeight={900}>
            {child}
        </Box>
    </>
}
export default Create;

const Form: ForwardRefRenderFunction<{ currHp: number, level: number, power: number, quantity: number ,gasLimit:number,gasPrice:number}, { name?: string,referenceLimit?:string }> = (props, ref) => {
    const {referenceLimit} = props
    const [currHp, setCurrHp] = useState(100)
    const [level, setLevel] = useState(1)
    const [power, setPower] = useState(100)
    const [quantity, setQuantity] = useState(1)
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
    const handleCurrHpChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setCurrHp(isNaN(_value) ? 100 : _value)
    }, [])
    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setQuantity(isNaN(_value) ? 1 : _value)
    }, [])
    const handleLevelChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setLevel(isNaN(_value) ? 1 : _value)
    }, [])
    const handlePowerChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const _value = Number.parseInt(e.target.value)
        setPower(isNaN(_value) ? 100 : _value)
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
        currHp,
        level,
        power,
        quantity,
        gasPrice,
        gasLimit
    }), [currHp, level, power, quantity,gasLimit,gasPrice])
    return <>
        <Stack direction={"column"} spacing={3} marginTop={3}>
            <Typography>
                {props.name || ''}
            </Typography>
            <TextField
                label="currHp"
                type={"number"}
                value={currHp}
                onChange={handleCurrHpChange}
                helperText={'默认值为100'}
            />
            <TextField
                label="quantity"
                type={"number"}
                value={quantity}
                onChange={handleQuantityChange}
                helperText={'默认值为1'}
            />
            <TextField
                label="level"
                type={"number"}
                value={level}
                onChange={handleLevelChange}
                helperText={'默认值为1'}
            />
            <TextField
                label="power"
                type={"number"}
                value={power}
                onChange={handlePowerChange}
                helperText={'默认值为100'}
            />
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
const FormRef = React.forwardRef(Form);
