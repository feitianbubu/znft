import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getHeroClockAction, getHeroCore, getNFTList, IChainContractConfigMap, IChainItem} from "@/pc/services/contract";
import {CustomCard, EArrangement} from "@/pc/components/market";
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Rating,
    Stack,
    Typography
} from "@mui/material";
import {Masonry} from "@mui/lab";
import {weiToEth} from "@/pc/utils/eth";
import {heroesJson} from "@/pc/constant";
import {useLoading, useMount} from "@lib/react-hook";
import {useSnackbar} from "notistack";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {BigNumber, ethers} from "ethers";
import {useWallet} from "@/pc/context/wallet";
import Provider from "@/pc/instance/provider";
import {LoadingButton} from '@mui/lab'

const mockImage = [
    'https://m.yh31.com/tp/zjbq/202109040904253416.jpg',
    'https://img.wxcha.com/m00/42/60/638abd891b32310bef50b00fa5dee34a.jpg',
    'https://i3.meixingnan.com/c5deff1b7a804511d3/918ba34d/9289a348/c28cf8062a925f008f69.jpg',
    'https://img.kuaiyong.com/pkfile/202111/02183823vmdq.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFvd9r9LC4M5Z3fUGlMnqElEckJoaP7uMfyA&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8dXROc6lez26lC3-R28Rg8QXm7QJKfj91fg&usqp=CAU',
    'https://img.haote.com/upload/news/20191108/157317782067267.jpg',
    'https://img.kuaiyong.com/pkfile/202111/02183823vmdq.jpg',
    'https://tva1.sinaimg.cn/large/9150e4e5gy1frjcs5kblwj20750h4dfv.jpg'
]
const Hero: React.FC<{ contractMap: IChainContractConfigMap, list: IChainItem[], arrangement: EArrangement, loading?: boolean }> = (props) => {
    const {contractMap, list, arrangement, loading} = props;
    const {enqueueSnackbar} = useSnackbar()
    const [wallet] = useWallet();
    const {chainId, address} = wallet;
    const [heroesMap, setHeroesMap] = useState<{ [key: string]: string }>({});

    const [auctionAbi, setAuctionAbi] = useState<ContractInterface>();
    const [heroAbi, setHeroAbi] = useState<ContractInterface>();
    const initMap = useCallback(() => {
        const map: { [key: string]: string } = {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    }, [])
    const [loadAuctionAbi, auctionAbiLoading] = useLoading(getHeroClockAction);
    const [loadNFTList, loadNFTListLoading] = useLoading(getNFTList);
    const [loadHeroAbi, heroAbiLoading] = useLoading(getHeroCore);
    const [myList,setMyList] = useState<IChainItem[]>([])
    const auctionContractInstanceRef = useRef<ethers.Contract | null>();
    const heroContractInstanceRef = useRef<ethers.Contract | null>();
    const [connectLoading, setConnectLoading] = useState(false)
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
                const l  = await loadNFTList({chainID:chainId,owner:address})
                if(l){
                    console.log(l)
                    setMyList(l.items)
                }

            }
        }
        setConnectLoading(false)
    }, [enqueueSnackbar, loadNFTList])

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

    const handleBuy = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset?.id;
        const value =  e.currentTarget.dataset?.value;
        const contractInstance = auctionContractInstanceRef.current;
        if (chainId) {
            const chain = contractMap[chainId]
            const {HeroContractAddress} = chain || {}
            if (id && contractInstance && HeroContractAddress&&value&&address) {
                const params = {
                    value:ethers.utils.parseUnits(value,'wei'),
                    from:address,
                }
                try {
                     await contractInstance.bid(HeroContractAddress, id,params)
                    enqueueSnackbar("已发起购买，请等待交易成功")
                }
                catch (e) {
                    enqueueSnackbar("发起失败",{variant: 'error'})
                }


            }
        }

    }, [address, chainId, contractMap, enqueueSnackbar])
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
        let image = mockImage[Math.floor(Math.random() * mockImage.length)]
        let name = heroesMap[item.tokenUri || '']
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
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
                {address == item.owner ? '已购买' :
                    <LoadingButton
                        loading={connectLoading || auctionAbiLoading}
                        data-id={item.tokenId}
                        data-value = {item.currentPrice}
                        variant={"contained"}
                        size={"small"}
                        onClick={handleBuy}
                    >
                        购买
                    </LoadingButton>}
            </CardActions>
        </CustomCard>
    }, [auctionAbiLoading, address, connectLoading, handleBuy, heroesMap])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        let image = item.tokenUri ? `https://img7.99.com/yhkd/image/data/hero//big-head/${item.tokenUri}.jpg` : 'http://172.24.135.32:3080/static/img/empty.jpg'
        let name = heroesMap[item.tokenUri || '']
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
                    {address == item.owner ? '已购买' : <LoadingButton
                        variant={"contained"}
                        size={"small"}
                        onClick={handleBuy}

                        loading={connectLoading || auctionAbiLoading}
                        data-id={item.tokenId}
                        data-value = {item.currentPrice}
                    >购买</LoadingButton>}
                </CardActions>
            </CustomCard>
        </Grid>

    }, [auctionAbiLoading, address, connectLoading, handleBuy, heroesMap])
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
    const myHeroList = useMemo(() => {
        if (loading) {
            return;
        }
        if (myList.length == 0) {
            return <Box minHeight={160} display={"flex"} alignItems={"center"} justifyContent={"center"}><Typography
                color={theme => theme.palette.text.primary} variant={'h6'} textAlign={"center"}>
                暂无项目
            </Typography>
            </Box>
        }
        if (arrangement == EArrangement.GRID) {
            return <Grid container spacing={2} columns={12}>
                {myList?.map(gridItemRender)}
            </Grid>
        } else if (arrangement == EArrangement.MASONRY) {
            return <Masonry columns={{xs: 1, sm: 3, md: 4}} spacing={2}>
                {myList.map(masonryItemRender)}
            </Masonry>
        }
    }, [arrangement, gridItemRender, loading, masonryItemRender, myList])
    return <Box>
        <Typography color={theme => theme.palette.text.primary} variant={'h4'} fontWeight={"bold"}>
            英雄
        </Typography>
        <Divider sx={{marginBottom: 3}}/>
        {heroList}
        <Typography color={theme => theme.palette.text.primary} variant={'h4'} fontWeight={"bold"} marginTop={3}>
            我的英雄
        </Typography>
        <Divider sx={{marginBottom: 3}}/>
        {myHeroList}
    </Box>
}
export default Hero;
