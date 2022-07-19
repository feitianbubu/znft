import NProgress from 'nprogress'
import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Rating, Typography} from '@mui/material'
import {
    getChainConfig,
    getNFTList,
    getHeroClockAction,
    getHeroCore,
    getMintBox,
    getPreSale,
    IChainItem,
    IChainContractConfig
} from "@/pc/services/contract";
import {ethers} from "ethers";
import Provider from "@/pc/instance/provider";
import {useWallet} from "@/pc/context/wallet";
import {useFilter} from "../context/filter-context";
import {EFilter} from "@/pc/constant/enum";
import {heroesJson} from "@/pc/constant";
import {styled} from '@mui/material/styles';
import {useLoading} from "@lib/react-hook";
import { useSnackbar} from "notistack";
import {message} from "@lib/util";

const isMintBox = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.MintBoxContractAddress;
}
const isPreSale = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.PreSaleContractAddress;
}
const CustomCard = styled(Card)({
    '&:hover': {
        boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        position: 'relative',
        left: -1,
        top: -1
    }
})
const Home: React.FC = () => {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [heroesMap,setHeroesMap] = useState<{[key:string]:string}>({})
    const[getList,loading] = useLoading(getNFTList);
    const [wallet] = useWallet();
    const {chainId,address} = wallet
    const [filter,,filterLoading,setFilterLoading] = useFilter()
    const [list,setList] = useState<IChainItem[]>([]);
    // const chainInfoRef = useRef<IChainContractConfig|undefined>();
    const [chainInfo,setChainInfo] = useState<IChainContractConfig|undefined>();
    const initMap = useCallback(()=>{
        const map :{[key:string]:string}= {};
        for (const heroesJsonElement of heroesJson) {
            map[heroesJsonElement.bsID] = heroesJsonElement.name
        }
        setHeroesMap(map)
    },[])
    const init = useCallback(async (chainId:string)=>{
        const [heroCore,HeroClockAction,mintBox,preSale,chainConfig] = await Promise.all([getHeroCore(),getHeroClockAction(),getMintBox(),getPreSale(),getChainConfig()]);
        const provider = await Provider.getInstance();
        let heroContract;
        let auctionContract;
        let mintBoxContract;
        let preSaleContract;
        if(provider&&chainConfig){
            const config = chainConfig.Chain[chainId];
            if(!config){
                // enqueueSnackbar('暂不支持该链', {variant: 'error', persist: true});
                return;
            }
            setChainInfo(config);
            try {
                if (heroCore) {
                    heroContract = new ethers.Contract(config.HeroContractAddress, heroCore, provider);
                }
                if (HeroClockAction) {
                    auctionContract = new ethers.Contract(config.AuctionContractAddress, HeroClockAction, provider);
                }
                if (mintBox) {
                    mintBoxContract = new ethers.Contract(config.MintBoxContractAddress, mintBox, provider);
                }
                if (preSale) {
                    try {
                        preSaleContract = new ethers.Contract(config.PreSaleContractAddress, preSale, provider);
                    } catch (e) {
                        console.log('get preSaleContract fail', e, provider);
                    }
                }
            } catch (e: any) {
                console.log('init contract fail', e);
                enqueueSnackbar(e);
            }
            closeSnackbar();
        }

        console.log(heroContract, auctionContract, mintBoxContract, preSaleContract)
    },[closeSnackbar, enqueueSnackbar])
    useEffect(()=>{
        if(chainId){
            init(chainId).then()
        }
        initMap();
    },[chainId, init, initMap]);
    const getItemList = useCallback(async (filter:string)=>{
        console.log(chainInfo,chainId,address)
        if(chainInfo&&chainId&&address){
            switch (filter) {
                case EFilter.市场:
                    const res1 = await getList({chainID:chainId,owner:chainInfo.AuctionContractAddress});
                    if(res1){setList(res1.items)}
                    break;
                case EFilter.我的:
                    const res2 = await getList({chainID:chainId,owner:address})
                    if(res2){setList(res2.items||[])}

            }
        }

    },[address, chainId, chainInfo, getList])
    useEffect(()=>{
        if(filterLoading!=loading){
            setFilterLoading(loading)
            if(loading){
                NProgress.start();
            }else{
                NProgress.done();
            }
        }
    },[filterLoading, loading, setFilterLoading])
    useEffect(() => {
        getItemList(filter).then();
    }, [filter, getItemList, chainInfo])

    // useEffect(()=>{},[chainInfo])
    const listRender = useCallback(( item:IChainItem)=>{
        const rateNum =  Number.parseInt(item.quality||'1');
        const rate = rateNum==0?1:rateNum;
        let image = item.tokenUri?`/web/images/heroes/${item.tokenUri}.jpg`: '/web/images/empty.jpg'
        let name = heroesMap[item.tokenUri||'']
        if(chainInfo){
            if(isPreSale(item,chainInfo)){
                image = "/web/images/preSale.jpg";
                name='预售'
            }
            if(isMintBox(item,chainInfo)){
                image = "/web/images/mintBox.jpg";
                name='盲盒'
            }
        }

        return<Grid item={true} key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`}>
            <CustomCard  sx={{ maxWidth: 250 }}>
                <CardMedia
                    component="img"
                    alt="green iguana"
                    image={image}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {name}
                    </Typography>
                    <Rating name="read-only" value={rate} readOnly />
                </CardContent>
                <CardActions>
                    <Button variant={"contained"} size={"small"} onClick={() => enqueueSnackbar(`开发中...`)}>购买</Button>
                </CardActions>
            </CustomCard>
        </Grid>
    },[chainInfo, enqueueSnackbar, heroesMap])
    return <Grid container spacing={2} rowSpacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        {list?.map(listRender)}
    </Grid>
}
export default Home


