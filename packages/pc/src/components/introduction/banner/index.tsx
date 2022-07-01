import React from "react";
import {keyframes, styled, Typography} from "@mui/material";
import bg from "@/pc/asset/bg.jpeg";
import spaceStation from "@/pc/asset/space-station.png";
import astronaut from "@/pc/asset/astronaut.png";
import {ENUM_BREAK_POINTS} from "@/pc/constant/enum";

const BannerBody  = styled('div')({
    width:'100%',
    minHeight:'900px',
    backgroundImage: `url(${bg.src})`,
    backgroundSize:'cover',
    position:'relative'
})

const SpaceStation  = styled('div')(({theme})=>({
    width:480,
    height:450,
    backgroundImage:`url(${spaceStation.src})`,
    position:'absolute',
    right:0,
    backgroundSize: 'contain',
    [theme.breakpoints.down(ENUM_BREAK_POINTS.MD)]: {
        top:800,
    },
    [theme.breakpoints.up(ENUM_BREAK_POINTS.MD)]: {
        top:500,
    },
}))
const bounce = keyframes`
       25%{
         -webkit-transform: translateY(-4px);
       }
       50%,100%{
         -webkit-transform: translateY(0);
       }
       75%{
         -webkit-transform: translateY(4px);
       }
`;
const Astronaut  = styled('div')(({theme})=>({
    width:160,
    height:380,
    backgroundImage:`url(${astronaut.src})`,
    position: 'absolute',
    right: 160,
    backgroundSize:'contain',
    animation: `${bounce} 1.6s linear infinite`,
    [theme.breakpoints.down(ENUM_BREAK_POINTS.MD)]: {
        top:400,
    },
    [theme.breakpoints.up(ENUM_BREAK_POINTS.MD)]: {
        top:200,
    },
}))
const BannerMask = styled('div')(({theme})=>{
    return {
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        background: `linear-gradient(0deg, ${theme.palette.background.default},transparent 50%, ${theme.palette.background.default})`,
    }
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
const Title = styled('div')`
  font-size: 56px;
  font-weight: bold;
`
const SubTitle = styled(Title)`
  margin-top: 96px;
  font-size: 40px;
`
const WhoIAm = styled(Typography)(({theme})=>(
    {
        [theme.breakpoints.down(ENUM_BREAK_POINTS.MD)]: {
            marginTop:1080,
        },
        [theme.breakpoints.up(ENUM_BREAK_POINTS.MD)]: {
            marginTop:480,
        },
    }
))
const IAm = styled(Typography)`
padding-left: 24px;
  padding-right: 24px;
`

const Banner:React.FC = ()=>{

    return <BannerBody>
        <BannerMask/>
        <Panel>
            <SpaceStation/>
            <Astronaut/>
            <LinearGradient>
                <SubTitle>全网最牛逼的</SubTitle>
                <Title>GameFi as a Service</Title>
            </LinearGradient>

            <Typography color={theme=>theme.palette.text.primary} variant={'h4'} fontWeight={"bold"} padding={3}>累计撮合 百万+ 游戏NFT</Typography>
            <WhoIAm color={theme=>theme.palette.text.primary} variant={'h6'} fontWeight={"bold"} padding={3}>我们是谁？</WhoIAm>
            <IAm color={theme=>theme.palette.text.primary} padding={3}>nd Space 为 GameFi 领域重要基础设施，为游戏厂商提供一站式的 GaaS 服务，助其一键进入 GameFi 领域。只需要集成 Game Space 提供的 SDK 交易组件，即可快速搭建一个游戏内置 NFT 交易市场。</IAm>
            <IAm color={theme=>theme.palette.text.primary} >Game Space，开启 GameFi as a Service 新时代！</IAm>
        </Panel>
    </BannerBody>
}
export  default  Banner;
