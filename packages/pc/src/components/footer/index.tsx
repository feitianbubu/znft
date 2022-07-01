import React from "react";
import {Button, Divider, Grid, IconButton, OutlinedInput, styled, Typography,InputAdornment} from "@mui/material";
import {FacebookOutlined,Telegram,Instagram,Reddit} from '@mui/icons-material';
const BannerBody  = styled('div')({
    width:'100%',
    minHeight:'200px',
    backgroundSize:'cover',
    position:'relative',
    marginTop:60
})
const Panel = styled(`div`)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
`
const Footer:React.FC = ()=>{
    return <>        <Divider/>
        <BannerBody >
      <Panel>

          <Grid container={true}>
              <Grid item={true} xs={12} md={6}>
                  <Typography color={theme=>theme.palette.text.primary} variant={'h5'} fontWeight={"bold"} textAlign={'center'}>
                      加入我们
                  </Typography>
                  <Grid container={true} textAlign={'center'} paddingLeft={16} paddingRight={16}>
                      <Grid item={true} xs={3}>
                          <IconButton size={"large"}>
                              <FacebookOutlined fontSize={'large'}/>
                          </IconButton>
                      </Grid>
                      <Grid item={true} xs={3}>
                          <IconButton size={"large"}>
                              <Telegram fontSize={'large'}/>
                          </IconButton>
                      </Grid>
                      <Grid item={true} xs={3}>
                          <IconButton size={"large"}>
                              <Instagram fontSize={'large'}/>
                          </IconButton>
                      </Grid>
                      <Grid item={true} xs={3}>
                          <IconButton size={"large"}>
                              <Reddit fontSize={'large'}/>
                          </IconButton>
                      </Grid>
                  </Grid>

              </Grid>
              <Grid item={true} xs={12} md={6} textAlign={'center'}>
                  <Typography color={theme=>theme.palette.text.primary} variant={'h5'} marginBottom={2}>
                      订阅消息
                  </Typography>
                  <OutlinedInput size={"small"}  endAdornment={<InputAdornment position="end">
                      <Button variant={'contained'} size={"small"}>
                          提交
                      </Button>
                  </InputAdornment>}/>
              </Grid>
          </Grid>
      </Panel>
    </BannerBody>
        </>
}
export default React.memo(Footer)
