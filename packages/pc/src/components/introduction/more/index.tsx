import React from "react";
import {Box, Card, styled} from "@mui/material";
import {Grid, Typography} from '@mui/material';

import Image from 'next/image'
import recharge from '@/pc/asset/recharge.png';
import swap from '@/pc/asset/swap.png';
import services from '@/pc/asset/services.png';
import more from '@/pc/asset/more.png';
import bg1 from "@/pc/asset/bg-part1.png";

const BannerBody = styled('div')({
    width: '100%',
    minHeight: '900px',
    backgroundImage:`url(${bg1.src})`,
    backgroundSize:'contain',
    backgroundRepeat: 'repeat-y',
    position: 'relative',
    marginTop: 180
})

const Item = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position:relative;
`;
const CardItem = styled(Card)(({theme}) => {
    return {
        width: 400,
        margin: '24px 0',
        minHeight: 400,

    }
})
const Icon = styled(Box)((props) => {
    return {
        position: 'absolute',
    }
})
const Panel = styled('div')`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 24px;
`
const TextItem = styled('div')`
  height: 100%;
  width: 100%;
  padding: 60px;
  text-align: center;
`

const More: React.FC = () => {
    return <BannerBody>
        <Panel>
            <Box width={'100%'} marginBottom={12}>
                <Typography variant="h3" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                    更多功能即将上线……
                </Typography>
            </Box>
            <Grid container spacing={12} justifyContent={"center"} alignItems={'center'}>
                <Item item xs={12} md={6}>
                    <Icon  top={60} left={312}>
                        <Image height={107} width={96} src={recharge} alt={'法币充值'}/>
                    </Icon>
                    <CardItem>
                        <TextItem>
                            <Typography variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                                法币充值
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 通过专业的第三方服务商Banxa为游戏用户提供“法币-加密货币”互换的功能，帮助没有接触过加密货币的用户简单快速的兑换加密货币，同时通过 KYC
                                系统，来保证资金的合规性，最终帮助游戏厂商高效的吸引传统Web 2.0领域的游戏用户。
                            </Typography>
                        </TextItem>
                    </CardItem>
                </Item>
                <Item item xs={12} md={6}>
                    <Icon  top={80} left={312}>
                        <Image height={89} width={96} src={swap} alt={'交易所'}/>
                    </Icon>
                    <CardItem>
                        <TextItem>
                            <Typography variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                                Token Swap
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 不仅提供 NFT 交易组件，同时也将提供 Token Swap 交易组件，帮助游戏厂商快速部署 Token 合约及流动性，实现游戏内 Token
                                的应用场景，为游戏厂商的经济模型提供完善的基础设施服务。
                            </Typography>
                        </TextItem>
                    </CardItem>
                </Item>
                <Item item xs={12} md={6}>
                    <Icon  top={80} left={312}>
                        <Image height={68} width={96} src={services} alt={'服务'}/>
                    </Icon>
                    <CardItem>
                        <TextItem>
                            <Typography variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                                优质服务
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 将以客户的需求为导向，不断推陈出新，持续性地提供优质服务，突破界限并设立行业新标准。
                            </Typography>
                        </TextItem>
                    </CardItem>
                </Item>
                <Item item xs={12} md={6}>
                    <Icon  top={80} left={312}>
                        <Image height={74} width={96} src={more} alt={'更多'}/>
                    </Icon>
                    <CardItem>
                        <TextItem>
                            <Typography variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                                更多
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 将会优先考虑社区用户的利益，并与我们的合作伙伴保持紧密的联系，不断探索、推出更多新功能。
                            </Typography>
                        </TextItem>
                    </CardItem>
                </Item>
            </Grid>
        </Panel>
    </BannerBody>
}
export default More;
