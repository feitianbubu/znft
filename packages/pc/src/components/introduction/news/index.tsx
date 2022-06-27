import React from "react";
import {Box, Button, Card, Stack, styled, TextField} from "@mui/material";
import {Grid, Typography} from '@mui/material';
import bg1 from "@/pc/asset/bg-part1.png";
import Image from 'next/image'
import logo from '@/pc/asset/logo.webp'
import moyu from '@/pc/asset/logo-moyu.webp'
import metamask from '@/pc/asset/metamask-logo.png'


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
  height: 600px;

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

const News: React.FC = () => {
    return <BannerBody>
        <Panel>
            <Box width={'100%'} marginBottom={0}>
                <Typography variant="h3" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                    新闻
                </Typography>
            </Box>
            <Grid container spacing={6} justifyContent={"center"} alignItems={'center'}>
                <Item item xs={12} md={4}>
                    <Box width={'100%'} height={'100%'}>
                        <Box height={400} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Image src={moyu} alt={'魔域'}/>
                        </Box>

                        <TextItem>

                            <Typography variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                魔域接入
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 已经和魔域达成合作，魔域将全面支持nft的接入。
                            </Typography>
                        </TextItem>
                    </Box>
                </Item>
                <Item item xs={12} md={4}>
                    <Box width={'100%'} height={'100%'}>
                        <Box height={400} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Image src={logo} alt={'英魂之刃'}/>
                        </Box>
                        <TextItem>

                            <Typography variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                英魂之刃接入
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 已经和英魂之刃达成合作，英魂之刃将全面支持nft的接入。
                            </Typography>
                        </TextItem>
                    </Box>

                </Item>
                <Item item xs={12} md={4}>
                    <Box width={'100%'} height={'100%'}>
                        <Box  height={400} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <Box bgcolor={'white'} borderRadius={2}>
                            <Image src={metamask} alt={'metamask'}/>
                            </Box>
                        </Box>
                        <TextItem>
                            <Typography variant="h5" fontWeight={'bold'} component="div" gutterBottom>
                                metamask
                            </Typography>
                            <Typography variant="body1" component="div" gutterBottom>
                                Nd Space 的nft市场支持使用metamask的使用。
                            </Typography>
                        </TextItem>
                    </Box>
                </Item>
            </Grid>
        </Panel>
    </BannerBody>
}
export default News;
