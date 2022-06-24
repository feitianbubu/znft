import React from "react";
import {Box, Button, Card, Stack, styled, TextField} from "@mui/material";
import {Grid, Typography} from '@mui/material';
import bg1 from "@/pc/asset/bg-part1.png";
import Image from 'next/image'
import logo from '@/pc/asset/logo.webp'
import moyu from '@/pc/asset/logo-moyu.webp'
import jizhan from '@/pc/asset/jizhan.webp'
import zhengfu from '@/pc/asset/zhengfu.webp'


const BannerBody = styled('div')({
    width: '100%',
    backgroundImage: `url(${bg1.src})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-y',
    position: 'relative',
    marginTop: 120
})
const Item = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;
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
  text-align: center;
`

const Game: React.FC = () => {
    return <BannerBody>
        <Panel>
            <Box width={'100%'} marginBottom={0}>
                <Typography variant="h3" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                    合作游戏
                </Typography>
            </Box>
            <Grid container spacing={6} justifyContent={"center"} alignItems={'center'}>
                <Item item xs={12} md={6}>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Image src={moyu}/>
                    </Box>
                </Item>
                <Item item xs={12} md={6}>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Image src={logo}/>
                    </Box>

                </Item>
                <Item item xs={12} md={6}>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Image src={jizhan}/>
                    </Box>
                </Item>
                <Item item xs={12} md={6}>
                    <Box  display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Image src={zhengfu}/>
                    </Box>
                </Item>
            </Grid>
        </Panel>
    </BannerBody>
}
export default Game;
