import React from "react";
import {Box, Button, Grid, keyframes, styled, Typography} from "@mui/material";
import Image from 'next/image';
import token from '@/pc/asset/token.png'
import market from '@/pc/asset/market.png'
import screen from '@/pc/asset/screen.png'
import appStore from '@/pc/asset/appStore.png'
import googlePlay from '@/pc/asset/googlePlay.png'
import androidDown from '@/pc/asset/androidDown.png'
const BannerBody  = styled('div')({
    width:'100%',
    minHeight:'732px',
    backgroundSize:'cover',
    position:'relative'
})

const Panel = styled(`div`)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
`
const LinearGradient = styled('div')`
  padding: 24px;
  background: linear-gradient(90deg,#ff67e7 3.2%,#5c7bf7 56.6%,#00c7e4 94.95%);
  background-clip: text;
  text-fill-color: transparent;
  width: fit-content;
`
const Video = styled('video')`
  width: 100%;
  height: 100%;
`
const Banner:React.FC = ()=>{

    return <BannerBody>
        <Panel>
            <LinearGradient>
                <Box fontWeight={'bold'} fontSize={56} marginTop={12}>下载 Nd Space App</Box>
                <Box fontWeight={'bold'} fontSize={56}>开启游戏NFT资产交易</Box>
            </LinearGradient>
            <Box position={"relative"}>
                <Grid container={true} spacing={3}>
                    <Grid xs={6} md={3} item={true}>
                        <Image src={token} alt={'资产'}/>
                    </Grid>
                    <Grid xs={6} md={3} item={true}>
                        <Image src={market} alt={'市场'}/>
                    </Grid>
                    <Grid xs={12} md={6} item={true}>
                        <Image src={screen} alt={'网页'}/>
                    </Grid>
                </Grid>
            </Box>
            <Typography color={theme=>theme.palette.text.primary} variant={'h4'} marginTop={12} marginBottom={6} fontWeight={'bold'} textAlign={'center'}>
                如果您是我们的用户，请在下列方式中选择一种下载 Nd Wallet
            </Typography>
            <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
                <Image src={appStore} alt={'苹果商店'} height={65} width={218}/>
                <Image src={googlePlay} alt={'谷歌商店'} height={65} width={218}/>
                <Image src={androidDown} alt={'安卓商店'} height={65} width={218}/>
            </Box>
            <Typography color={theme=>theme.palette.text.primary} variant={'h4'} marginTop={12} marginBottom={6} fontWeight={'bold'} textAlign={'center'}>
                如果您是游戏厂商，请下载 SDK
            </Typography>
            <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'}>
               <Button variant={'outlined'} size={'large'} style={{height:65,width:218}}>下载sdk</Button>
            </Box>
            <Box padding={18}>
                <Video controls>
                    <source src="https://gs-mall-static-cdn.game.space/official/video/intro3.mp4" type="video/mp4"/>
                </Video>
            </Box>

        </Panel>
    </BannerBody>
}
export  default  Banner;
