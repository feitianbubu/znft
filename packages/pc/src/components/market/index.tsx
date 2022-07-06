import React, {useCallback, useState} from "react";
import {
    Box,
    Tabs,
    Tab,
    Card,
    SvgIcon,
    Typography
} from "@mui/material";
import {useLoading, useMount, useSubscribe} from "@lib/react-hook";
import {getChainConfig, getNFTList, IChainContractConfigMap, IChainContractConfig, IChainItem} from "@/pc/services/contract";
import {useWallet} from "@/pc/context/wallet";
import {styled} from "@mui/material/styles";
import Hero from "@/pc/components/market/list/hero";
import BlindBox from "@/pc/components/market/list/blindBox";
import PreSale from "@/pc/components/market/list/preSale";
import SubNav from "@/pc/components/market/subNav";
// todo 现在svg太大 不知道怎么处理
const GridSvg :React.FC = ()=>{
    return <SvgIcon>
        <path
              d="M938.666667 554.624V853.333333a42.666667 42.666667 0 0 1-42.666667 42.666667h-341.333333v-341.376h384z m-469.333334 0V896H128a42.666667 42.666667 0 0 1-42.666667-42.666667v-298.709333h384zM469.333333 128v341.290667H85.333333V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h341.333333z m426.666667 0a42.666667 42.666667 0 0 1 42.666667 42.666667v298.624h-384V128h341.333333z"/>
    </SvgIcon>
}

const MasonrySvg :React.FC = ()=>{
    return <SvgIcon>
        <path
              d="M938.666667 426.624V853.333333a42.666667 42.666667 0 0 1-42.666667 42.666667h-341.333333V426.624h384z m-469.333334 256V896H128a42.666667 42.666667 0 0 1-42.666667-42.666667v-170.709333h384zM469.333333 128v469.290667H85.333333V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h341.333333z m426.666667 0a42.666667 42.666667 0 0 1 42.666667 42.666667v170.624h-384V128h341.333333z"/>
    </SvgIcon>
}
const isMintBox = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.MintBoxContractAddress;
}
const isPreSale = (item: IChainItem, chainInfo: IChainContractConfig) => {
    return item.creator && item.creator === chainInfo.PreSaleContractAddress;
}

export const CustomCard = styled(Card)({
    '&:hover': {
        boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        position: 'relative',
        left: -1,
        top: -1
    }
})

export enum EArrangement {
    GRID = 'grid',
    MASONRY = 'masonry'
}
interface TabPanelProps {
    children?: React.ReactNode;
    name: string|number;
    value: string|number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, name } = props;

    return (
        <Box
          hidden={value!=name}
        >
            {children}
        </Box>
    );
}
const Home: React.FC = () => {
    const [wallet] = useWallet();
    const {chainId} = wallet;
    const [value, setValue] = React.useState<string|number>('hero');
    const [loadChain, loadChainLoading] = useLoading(getChainConfig);
    const [loadNFTList, loadNFTListLoading] = useLoading(getNFTList);
    const [contractMap, setContractMap] = useState<IChainContractConfigMap>({})
    const [status, setStatus] = useState<null | 'error' | 'waring' | 'success' | 'chainNotSupport'>(null);
    const [heroList, setHeroList] = useState<IChainItem[]>([]);
    const [blindBoxList, setBLindBoxList] = useState<IChainItem[]>([]);
    const [preSaleList, setPreSaleList] = useState<IChainItem[]>([]);
    const [arrangement, setArrangement] = useState<EArrangement.GRID | EArrangement.MASONRY>(EArrangement.GRID);
    const getContractAddress = useCallback(async () => {
        const chainConfig = await loadChain();
        if (chainConfig) {
            setContractMap(chainConfig.Chain)
        }
    }, [loadChain])
    const verify = useCallback((chainId: string, contractMap: IChainContractConfigMap) => {
        const chain = contractMap[chainId];
        if (!chain) {
            // 不支持该链
            // enqueueSnackbar('暂不支持当前链', {variant: 'error'})
            setStatus("chainNotSupport")
            return;

        } else {
            setStatus("success")
            return chain;
        }
    }, [])
    const getNFTListByAddress = useCallback(async (chainId: string, address: string,chain:IChainContractConfig) => {
        const res = await loadNFTList({chainID: chainId, owner: address});
        if (res&&res.items) {
            const hero:IChainItem[] = []
            const blindBox:IChainItem[]=[]
            const preSale:IChainItem[] = []
            for (const item of res.items) {
                if(isPreSale(item,chain)){
                    preSale.push(item)
                }else if(isMintBox(item,chain)){
                    blindBox.push(item)
                }else{
                    hero.push(item)
                }
            }
            setHeroList(hero)
            setBLindBoxList(blindBox)
            setPreSaleList(preSale)
        }
    }, [loadNFTList])

    useMount(() => {
        getContractAddress().then();
    })
    /**
     * 观察者模式副作用方法
     * 当chainId变化时，检查当前的链支不支持nft市场
     */
    useSubscribe(() => {
        if (chainId && contractMap) {
            const chain = verify(chainId, contractMap)
            if (chain) {
                getNFTListByAddress(chainId, chain.AuctionContractAddress,chain).then()
            }
        }

        /**
         * 每当切换链的时候，会校验一次是否支持,如果支持就把合同地址存到ref里面
         * getNFTListByAddress和loadChain是静态函数，不会变化，所以不用监听
         */
    }, [chainId, contractMap], [])

    const handleArrangementChange = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, value?: string) => {
        if (value) {
            setArrangement(value as EArrangement)
        }
    }, [])
    const handleChange = useCallback((event: React.SyntheticEvent, newValue: number|string) => {
        setValue(newValue);
    },[])
    return <Box paddingLeft={6} paddingRight={6} minHeight={800}>
        <SubNav onArrangementChange={handleArrangementChange} arrangement={arrangement} status={status} contractMap={contractMap} loadChainLoading={loadChainLoading} loadNFTListLoading={loadNFTListLoading} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered={true}>
                <Tab label={<Typography color={theme => theme.palette.text.primary} variant={'h5'} fontWeight={"bold"}>
                    英雄
                </Typography>} value={'hero'}/>
                <Tab label={<Typography color={theme => theme.palette.text.primary} variant={'h5'} fontWeight={"bold"}>
                    盲盒
                </Typography>} value={'blind'}/>
                <Tab label={<Typography color={theme => theme.palette.text.primary} variant={'h5'} fontWeight={"bold"}>
                    预售
                </Typography>} value={'sale'}/>
            </Tabs>
        </Box>
        <TabPanel value={value} name={'hero'}>
            <Hero list={heroList} contractMap={contractMap} arrangement={arrangement} loading={loadNFTListLoading||loadChainLoading}/>

        </TabPanel>
        <TabPanel value={value} name={'blind'}>
            <BlindBox list={blindBoxList} contractMap={contractMap} arrangement={arrangement} loading={loadNFTListLoading||loadChainLoading}/>

        </TabPanel>
        <TabPanel value={value} name={'sale'}>
            <PreSale list={preSaleList} contractMap={contractMap} arrangement={arrangement} loading={loadNFTListLoading||loadChainLoading}/>

        </TabPanel>
    </Box>
}
export default React.memo(Home);
