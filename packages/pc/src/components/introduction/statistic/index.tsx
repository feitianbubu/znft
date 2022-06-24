import React from "react";
import {Box, Button, Card, Grid, Stack, styled, TextField, Typography} from "@mui/material";
import bg1 from "@/pc/asset/bg-part1.png";
import bgMilestones from "@/pc/asset/bg-milestones.png";

const BannerBody = styled('div')({
    width: '100%',
    backgroundImage:`url(${bg1.src})`,
    backgroundSize:'contain',
    backgroundRepeat: 'repeat-y',
    position: 'relative',
    marginTop: 120
})
// background: `linear-gradient(0deg, ${theme.palette.background.default},transparent 50%, ${theme.palette.background.default})`,

const Panel = styled('div')`
  max-width: 1200px;
  width: 100%;
  background-image: url("${bgMilestones.src}");
  //background-size: contain;
  margin: 0 auto;
  position: relative;
  padding: 60px;
`
const Mask = styled('div')(({theme})=>{
    return {
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        background:`
        linear-gradient(0deg, ${theme.palette.background.default},transparent 10%,transparent 95%, ${theme.palette.background.default}),
        linear-gradient(90deg, ${theme.palette.background.default},transparent 10%,transparent 95%, ${theme.palette.background.default})
        `
    }
})
const Item = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const TextItem = styled('div')`
  height: 100%;
  width: 100%;
  text-align: center;
`
const Statistic:React.FC = ()=>{
    return <BannerBody>
        <Panel>
            <Mask/>
            <Box width={'100%'} marginBottom={12}>
                <Typography variant="h3" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                    我们已经实现
                </Typography>
            </Box>
            <Grid container spacing={12} justifyContent={"center"} alignItems={'center'}>
                <Item item xs={12} md={6}>
                    <TextItem>
                        <Typography variant="h2" fontWeight={'bold'} component="div" gutterBottom>
                            6,817,984,518
                        </Typography>
                        <Typography variant="h5" component="div" gutterBottom>
                           注册用户
                        </Typography>
                    </TextItem>
                </Item>
                <Item item xs={12} md={6}>
                    <TextItem>
                        <Typography variant="h2" fontWeight={'bold'} component="div" gutterBottom>
                            $956,394,867,112
                        </Typography>
                        <Typography variant="h5" component="div" gutterBottom>
                            交易量
                        </Typography>
                    </TextItem>
                </Item>
                <Item item xs={12} md={6}>
                    <TextItem>
                        <Typography variant="h2" fontWeight={'bold'} component="div" gutterBottom>
                            7,111,652,418
                        </Typography>
                        <Typography variant="h5" component="div" gutterBottom>
                            NFT 铸造量
                        </Typography>
                    </TextItem>
                </Item>
                <Item item xs={12} md={6}>
                    <TextItem>
                        <Typography variant="h2" fontWeight={'bold'} component="div" gutterBottom>
                            57,000 USDT
                        </Typography>
                        <Typography variant="h5" component="div" gutterBottom>
                            NFT 最高售价
                        </Typography>
                    </TextItem>
                </Item>
            </Grid>
        </Panel>
    </BannerBody>
}
export  default Statistic;
