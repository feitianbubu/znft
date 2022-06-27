import React from "react";
import {Box, Grid, styled, Typography} from "@mui/material";
import Image from 'next/image'
import moyubg from '@/pc/asset/moyubg.webp'
import appStore from '@/pc/asset/appStore.png'
import googlePlay from '@/pc/asset/googlePlay.png'
import androidDown from '@/pc/asset/androidDown.png'
import yinghunbg from '@/pc/asset/yinghunbg.webp'
import {StaticImageData} from "next/dist/client/image";
const Body = styled('div')`
    width: 100%;
  min-height: 200px;
  margin-top: 120px;
  margin-bottom: 120px;
  
`
const Panel = styled(`div`)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 12px;
`
interface  IData{
    image:string| StaticImageData,
    title:string,
    type:string
    develop:string
    status:string
    platform:string
}
const data:IData[] = [
    {
        image:moyubg,
        title:'口袋魔域',
        type:'角色扮演',
        develop:'nd',
        status:'Release',
        platform:'Mobile'
    },
    {
        image:yinghunbg,
        title:'英魂之刃',
        type:'moba',
        develop:'nd',
        status:'Release',
        platform:'Mobile'
    }
]
const Game:React.FC = ()=>{
    return <Body>
        <Panel>
            <Grid container={true} spacing={3}>
            {data.map((item)=>{
                return <Grid item={true} key={item.title}>
                    <Grid container={true} spacing={12} >
                        <Grid xs={12} md={6} item={true}>
                            <Box borderRadius={12} overflow={"hidden"}>
                                <Image src={item.image} alt={item.title}/>
                            </Box>
                        </Grid>
                        <Grid xs={12} md={6}  item={true}>
                            <Grid container={true} spacing={3}>
                                <Grid item={true} xs={12}>
                                    <Typography variant={'h4'} fontWeight={'bold'}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={6}>
                                    <Typography variant={'h5'}>
                                        游戏类型
                                    </Typography>
                                    <Typography variant={'body1'} fontWeight={'bold'}>
                                        {item.type}
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={6}>
                                    <Typography variant={'h5'}>
                                        开发者
                                    </Typography>
                                    <Typography variant={'body1'} fontWeight={'bold'}>
                                        {item.develop}
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={6}>
                                    <Typography variant={'h5'}>
                                        开发状态
                                    </Typography>
                                    <Typography variant={'body1'} fontWeight={'bold'}>
                                        {item.status}
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={6}>
                                    <Typography variant={'h5'}>
                                        平台
                                    </Typography>
                                    <Typography variant={'body1'} fontWeight={'bold'}>
                                        {item.platform}
                                    </Typography>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <Image src={appStore} alt={'苹果商店'}/>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <Image src={googlePlay} alt={'谷歌商店'}/>
                                </Grid>
                                <Grid item={true} xs={4}>
                                    <Image src={androidDown} alt={'安卓下载'}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            })}
                <Grid item={true} xs={12}>
                    <Typography textAlign={'center'} variant={'body1'}>
                        更多游戏即将上线
                    </Typography>
                </Grid>
            </Grid>
        </Panel>
    </Body>
}
export  default  Game;
