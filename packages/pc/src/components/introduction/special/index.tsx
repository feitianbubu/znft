import React, {useMemo} from "react";
import {Box, Button, Stack, styled, useMediaQuery, useTheme} from "@mui/material";
import {Grid, Typography} from '@mui/material';
import Image from 'next/image'
import market from '@/pc/asset/market.png'
import binance from '@/pc/asset/binance.png'
import eth from '@/pc/asset/eth.png'
import heco from '@/pc/asset/heco.png'
import flow from '@/pc/asset/flow.png'
import ftm from '@/pc/asset/ftm.png'
import polygon from '@/pc/asset/polygon.png'
import solana from '@/pc/asset/solana.png'
import avax from '@/pc/asset/avax.png'
import admin from '@/pc/asset/admin.png'
import security from '@/pc/asset/security.png'
import nft from '@/pc/asset/nft.png'
import airdrop from '@/pc/asset/airdrop.png'
import box from '@/pc/asset/box.png'
import auction from '@/pc/asset/auction.png'
import bg1 from '@/pc/asset/bg-part1.png'
import {ENUM_BREAK_POINTS} from "@/pc/constant/enum";

const BannerBody = styled('div')({
    width: '100%',
    backgroundImage:`url(${bg1.src})`,
    backgroundSize:'contain',
    backgroundRepeat: 'repeat-y',
    position: 'relative',
    marginTop:180
})

const Item = styled(Grid)(({theme})=>({
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    [theme.breakpoints.down(ENUM_BREAK_POINTS.MD)]: {
        minHeight:200,
    },
    [theme.breakpoints.up(ENUM_BREAK_POINTS.MD)]: {
        minHeight:600,
    },
}))
const Panel = styled('div')`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 24px;
`
const Video = styled('video')`
  width: 100%;
  height: 100%;
`
const Market = styled('div')`
  width: 320px;
  height: 500px;
  background-image: url(${market.src});
  background-size: cover;
`
const TextItem = styled('div')`
  height: 100%;
  width: 100%;
  padding: 60px;
`
const ButtonItem = styled(Button)(({theme}) => {

    return {
        height: 108,
        width: 108,
        padding: 8,
        backgroundColor: theme.palette.action.hover
    }
})
const spacing = {xs:2,md:12}
const Special: React.FC = () => {
    const theme = useTheme();
    const isMD= useMediaQuery(theme.breakpoints.down(ENUM_BREAK_POINTS.MD));
    const children = useMemo(()=>{
        return isMD?<>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        一行代码即可接入
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 为游戏厂商提供便捷的 GameFi SDK，只需要少量代码就可以快速集成，最快一天即可部署上线，大大降低游戏厂商开发链游的时间。后续所有定制化的功能也将通过 SDK
                        接入。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Video controls>
                    <source src="https://gs-mall-static-cdn.game.space/official/video/code.mp4" type="video/mp4"/>
                </Video>

            </Item>
            <Item item xs={12} md={6}>
                <TextItem>


                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        独特的内置市场
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 提供功能完备的 NFT 交易市场，支持多币种交易，例如游戏内 Token、USDT、ETH等。根据不同游戏厂商的需要， Game Space
                        分别推出了中心化版本和去中心化版本的交易市场，以帮助游戏厂商面向不同的用户群体。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Market/>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>


                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        多链部署
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 第一期计划支持 ETH 及 BSC，并将陆续支持 POLYGON、FLOW、SOL、IMX、AVALANCHE、FANTOM、HECO
                        等多条公链。游戏厂商可在后台一键选择需要部署的公链，省去开发多套合约的繁琐工作，同时又可以享受多条公链带来的生态红利。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Stack direction={'column'} width={'100%'} spacing={2} textAlign={'center'}>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        已经上线
                    </Typography>
                    <Box textAlign={'center'} width={'100%'} alignItems={'center'} justifyContent={'center'}
                         display={'flex'}>
                        <Grid width={280} container spacing={2} justifyContent={"center"} alignItems={'center'}>
                            <Grid item xs={6}>
                                <ButtonItem>
                                    <Image src={binance} height={68} objectFit={"contain"} alt={'binance'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={6}>
                                <ButtonItem>
                                    <Image src={eth} height={68} objectFit={"contain"} alt={'eth'}/>
                                </ButtonItem>
                            </Grid>

                        </Grid>
                    </Box>

                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        敬请期待
                    </Typography>
                    <Box textAlign={'center'} width={'100%'} alignItems={'center'} justifyContent={'center'}
                         display={'flex'}>
                        <Grid container spacing={2} width={420} justifyContent={"center"} alignItems={'center'}>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={heco} height={68} width={68} objectFit={"contain"} alt={'heco'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={flow} height={68} width={68} objectFit={"contain"} alt={'flow'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={ftm} height={68} width={68} objectFit={"contain"} alt={'ftm'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={polygon} height={68} width={68} objectFit={"contain"} alt={'polygon'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={solana} height={68} width={68} objectFit={"contain"} alt={'solana'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={avax} height={68} width={68} objectFit={"contain"} alt={'avax'}/>
                                </ButtonItem>
                            </Grid>

                        </Grid>
                    </Box>
                </Stack>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        商业级后台
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 的商业级后台管理系统支持多维度的数据统计分析，包括钱包地址数据、NFT 交易数据等，同时会逐步完善用户的投资消费行为数据，提供多样化的高级管理工具，帮助游戏厂商更好的服务用户。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Image src={admin} alt={'admin'}/>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        安全保障
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 提供与顶级加密交易所相同级别的安全组件，所有合约均经过 Certik 等多家合约审计机构的审计。对用户提取 NFT、交易 NFT、充值 NFT 的全流程进行安全管控，保证用户资产安全，让游戏厂商可以专注于游戏内容开发。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Image src={security} alt={'security'}/>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        支持多种NFT发行方式
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 提供 IGO、空投、盲盒、拍卖、定价发行等多种 NFT 发行方式，以满足游戏厂商在不同阶段的 NFT 发行需求，同时 Game Space 也会有专业的支持人员提供指导，帮助游戏厂商用多种发行方式来吸引游戏用户。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Box width={280} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Grid spacing={6}  container={true}>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem >
                                <Image src={nft} height={120} objectFit={"contain"} alt={'nft'}/>

                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                IGO
                            </Typography>
                        </Grid>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem>
                                <Image src={airdrop} height={120} objectFit={"contain"} alt={'airdrop'}/>
                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                空投
                            </Typography>
                        </Grid>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem>
                                <Image src={box} height={120} objectFit={"contain"} alt={'box'}/>
                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                盲盒
                            </Typography>
                        </Grid>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem>
                                <Image src={auction} height={120} objectFit={"contain"} alt={'auction'}/>
                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                拍卖
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>


            </Item>

        </>:<>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography  color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        一行代码即可接入
                    </Typography>
                    <Typography  color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 为游戏厂商提供便捷的 GameFi SDK，只需要少量代码就可以快速集成，最快一天即可部署上线，大大降低游戏厂商开发链游的时间。后续所有定制化的功能也将通过 SDK
                        接入。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Video controls>
                    <source src="https://gs-mall-static-cdn.game.space/official/video/code.mp4" type="video/mp4"/>
                </Video>

            </Item>
            <Item item xs={12} md={6}>
                <Market/>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>


                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        独特的内置市场
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 提供功能完备的 NFT 交易市场，支持多币种交易，例如游戏内 Token、USDT、ETH等。根据不同游戏厂商的需要， Game Space
                        分别推出了中心化版本和去中心化版本的交易市场，以帮助游戏厂商面向不同的用户群体。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>


                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        多链部署
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 第一期计划支持 ETH 及 BSC，并将陆续支持 POLYGON、FLOW、SOL、IMX、AVALANCHE、FANTOM、HECO
                        等多条公链。游戏厂商可在后台一键选择需要部署的公链，省去开发多套合约的繁琐工作，同时又可以享受多条公链带来的生态红利。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Stack direction={'column'} width={'100%'} spacing={2} textAlign={'center'}>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        已经上线
                    </Typography>
                    <Box textAlign={'center'} width={'100%'} alignItems={'center'} justifyContent={'center'}
                         display={'flex'}>
                        <Grid width={280} container spacing={2} justifyContent={"center"} alignItems={'center'}>
                            <Grid item xs={6}>
                                <ButtonItem>
                                    <Image src={binance} height={68} objectFit={"contain"} alt={'binance'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={6}>
                                <ButtonItem>
                                    <Image src={eth} height={68} objectFit={"contain"} alt={'eth'}/>
                                </ButtonItem>
                            </Grid>

                        </Grid>
                    </Box>

                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        敬请期待
                    </Typography>
                    <Box textAlign={'center'} width={'100%'} alignItems={'center'} justifyContent={'center'}
                         display={'flex'}>
                        <Grid container spacing={2} width={420} justifyContent={"center"} alignItems={'center'}>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={heco} height={68} width={68} objectFit={"contain"} alt={'heco'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={flow} height={68} width={68} objectFit={"contain"} alt={'flow'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={ftm} height={68} width={68} objectFit={"contain"} alt={'ftm'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={polygon} height={68} width={68} objectFit={"contain"} alt={'polygon'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={solana} height={68} width={68} objectFit={"contain"} alt={'solana'}/>
                                </ButtonItem>
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonItem>
                                    <Image src={avax} height={68} width={68} objectFit={"contain"} alt={'avax'}/>
                                </ButtonItem>
                            </Grid>

                        </Grid>
                    </Box>
                </Stack>
            </Item>
            <Item item xs={12} md={6}>
                <Image src={admin} alt={'admin'}/>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        商业级后台
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 的商业级后台管理系统支持多维度的数据统计分析，包括钱包地址数据、NFT 交易数据等，同时会逐步完善用户的投资消费行为数据，提供多样化的高级管理工具，帮助游戏厂商更好的服务用户。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        安全保障
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 提供与顶级加密交易所相同级别的安全组件，所有合约均经过 Certik 等多家合约审计机构的审计。对用户提取 NFT、交易 NFT、充值 NFT 的全流程进行安全管控，保证用户资产安全，让游戏厂商可以专注于游戏内容开发。
                    </Typography>
                </TextItem>
            </Item>
            <Item item xs={12} md={6}>
                <Image src={security} alt={'security'}/>
            </Item>
            <Item item xs={12} md={6}>
                <Box width={280} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Grid spacing={6}  container={true}>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem >
                                <Image src={nft} height={120} objectFit={"contain"} alt={'nft'}/>

                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                IGO
                            </Typography>
                        </Grid>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem>
                                <Image src={airdrop} height={120} objectFit={"contain"} alt={'airdrop'}/>
                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                空投
                            </Typography>
                        </Grid>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem>
                                <Image src={box} height={120} objectFit={"contain"} alt={'box'}/>
                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                盲盒
                            </Typography>
                        </Grid>
                        <Grid item xs={6} justifyContent={'center'} alignItems={'center'} display={'flex'} flexDirection={'column'}>
                            <ButtonItem>
                                <Image src={auction} height={120} objectFit={"contain"} alt={'auction'}/>
                            </ButtonItem>
                            <Typography color={theme=>theme.palette.text.primary} variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                拍卖
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>


            </Item>
            <Item item xs={12} md={6}>
                <TextItem>
                    <Typography color={theme=>theme.palette.text.primary} variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                        支持多种NFT发行方式
                    </Typography>
                    <Typography color={theme=>theme.palette.text.primary} variant="body1" component="div" gutterBottom>
                        Nd Space 提供 IGO、空投、盲盒、拍卖、定价发行等多种 NFT 发行方式，以满足游戏厂商在不同阶段的 NFT 发行需求，同时 Game Space 也会有专业的支持人员提供指导，帮助游戏厂商用多种发行方式来吸引游戏用户。
                    </Typography>
                </TextItem>
            </Item>
        </>
    },[isMD])
    return <BannerBody>
        <Panel>
            <Box width={'100%'}>
                <Typography color={theme=>theme.palette.text.primary} variant="h3" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                    特色功能
                </Typography>
            </Box>
            <Grid container spacing={spacing} justifyContent={"center"} alignItems={'center'}>
                {children}
            </Grid>
        </Panel>
    </BannerBody>
}
export default Special;
