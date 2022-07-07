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
import {useLoading, useMount} from "@lib/react-hook";
import {useWallet} from "@/pc/context/wallet";
import {getChainConfig, getHeroCore, IChainContractConfigMap} from "@/pc/services/contract";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {ethers} from "ethers";
import {useSnackbar} from "notistack";
import {heroesJson} from "@/pc/constant";
import {IMintRequest, mint} from "@/pc/services/restful";
import {useContract} from "@/pc/context/contract";

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
    const [heroAbi, setHeroAbi] = useState<ContractInterface>();
    const [contract] = useContract();
    const {data:contractMap,loading:loadChainLoading} = contract
    const [loadHeroAbi, heroAbiLoading] = useLoading(getHeroCore);
    const [connectLoading, setConnectLoading] = useState(true)
    const heroContractInstanceRef = useRef<ethers.Contract | null>();
    const getHeroAbi = useCallback(async () => {
        const res = await loadHeroAbi();
        if (res) {
            setHeroAbi(res)
        }
    }, [loadHeroAbi])
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
                    console.log(CREATE_ROLE,address)
                    bool = await heroContractInstance.hasRole(CREATE_ROLE, address);
                }catch (e:any) {
                    console.log(e.message)
                    setHasAuth(false)
                    setConnectLoading(false)
                }

                setHasAuth(bool)
                setConnectLoading(false)
            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar])
    const initCon = useCallback(() => {

    }, [])
    const init = useCallback(async () => {
        getHeroAbi().then()
    }, [getHeroAbi])


    const handleClickCreate = useCallback((item: { bsID: number; name: string; }) => {
        setSelected(item);
        setVisible(true);
    }, [])
    useMount(() => {
        init().then()
    })
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
    const ref = useRef<{ currHp: number, level: number, power: number, quantity: number }>(null)
    const handleCreate = useCallback(async () => {
        const form = ref.current
        const heroContract = heroContractInstanceRef.current;
        if (address && heroContract) {
            if (form && selected) {
                // const {currHp, quantity, level, power} = form
                // const params: Partial<IMintRequest> = {
                //     "to": address,
                //     "tokenType": HERO_TYPE,
                //     "tokenCode": selected.bsID.toString(),
                // }
                try {
                    await heroContract.mint(address,HERO_TYPE,selected.bsID.toString())
                    enqueueSnackbar("铸造成功，等待上链",{variant:'success'})
                    setVisible(false);
                    setSelected(undefined)
                }catch (e) {
                    enqueueSnackbar("失败，请重试", {variant: "error"})
                    return
                }

            }
        } else {
            enqueueSnackbar("请链接钱包", {variant: "error"})
        }

    }, [address, enqueueSnackbar, selected])

    return <>
        <Modal
            open={visible}
            title={'铸造'}
            onCancel={handleCancel}
            onOk={handleCreate}
            keepMounted={true}
        >
            <FormRef name={selected?.name} ref={ref}/>
        </Modal>
        <Box minHeight={900}>
            {child}
        </Box>
    </>
}
export default Create;

const Form: ForwardRefRenderFunction<{ currHp: number, level: number, power: number, quantity: number }, { name?: string }> = (props, ref) => {
    const [currHp, setCurrHp] = useState(100)
    const [level, setLevel] = useState(1)
    const [power, setPower] = useState(100)
    const [quantity, setQuantity] = useState(1)
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
    useImperativeHandle(ref, () => ({
        currHp,
        level,
        power,
        quantity
    }), [currHp, level, power, quantity])
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
        </Stack>

    </>
}
const FormRef = React.forwardRef(Form);
