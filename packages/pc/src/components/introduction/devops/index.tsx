import React from "react";
import {Box, Button, Card, Stack, styled, TextField} from "@mui/material";
import {Grid, Typography} from '@mui/material';
import bg1 from "@/pc/asset/bg-part1.png";


const BannerBody = styled('div')({
    width: '100%',
    backgroundImage:`url(${bg1.src})`,
    backgroundSize:'contain',
    backgroundRepeat: 'repeat-y',
    position: 'relative',
    marginTop:60
})
const Item = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 600px;
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
  padding: 60px;
`

const Devops: React.FC = () => {
    return <BannerBody>
        <Panel>
            <Box width={'100%'} marginBottom={12}>
                <Typography variant="h3" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                    开发与部署
                </Typography>
            </Box>
            <Grid container spacing={12} justifyContent={"center"} alignItems={'center'}>
                <Item item xs={12} md={6}>
                    <TextItem>
                        <Typography variant="h4" fontWeight={'bold'} component="div" gutterBottom>
                            免费部署
                        </Typography>
                        <Typography variant="body1" component="div" gutterBottom>
                            Nd Space 所提供的服务均是免费的，只有在部署上线并产生 NFT 资产交易后才会收取一定的交易手续费。Game Space 的目标是帮助游戏厂商无缝跨入 GameFi 领域，因此无需担心在部署过程中有任何的额外成本。
                        </Typography>
                    </TextItem>
                </Item>
                <Item item xs={12} md={6}>
                    <Card title={'免费申请限量公测资格'} variant="outlined">
                        <Box width={480} padding={6}>

                            <Stack direction={'column'} spacing={2}>
                                <Typography variant="h5" textAlign={'center'} fontWeight={'bold'} component="div" gutterBottom>
                                    免费申请限量公测资格
                                </Typography>
                                <TextField label="公司名称" variant="outlined" />
                                <TextField label="工作岗位" variant="outlined" />
                                <TextField label="工作邮箱" variant="outlined" />
                                <TextField label="手机" variant="outlined" />
                                <TextField label="备注" variant="outlined" />
                                <Button variant={'outlined'}>申请</Button>
                            </Stack>
                        </Box>


                    </Card>
                </Item>

            </Grid>
        </Panel>
    </BannerBody>
}
export default Devops;
