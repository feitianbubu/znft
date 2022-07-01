import React, {useCallback, useMemo, useState} from "react";
import {IChainContractConfigMap, IChainItem} from "@/pc/services/contract";
import {CustomCard, EArrangement} from "@/pc/components/market";
import {
    Box,
    Button,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Rating,
    Stack,
    Typography
} from "@mui/material";
import {Masonry} from "@mui/lab";
import {weiToEth} from "@/pc/utils/eth";
import {useSnackbar} from "notistack";

const BlindBox:React.FC<{contractMap:IChainContractConfigMap,list:IChainItem[],arrangement:EArrangement,loading?:boolean}> = (props)=>{
    const {list,arrangement,loading} = props;
    const {enqueueSnackbar} = useSnackbar()
    const masonryItemRender = useCallback((item: IChainItem,) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        return <CustomCard
            key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`}
            elevation={0}
            variant="outlined"
        >
            <Box
                component="img"
                alt="The house from the offer."
                src={"http://172.24.135.32:3080/static/img/mintBox.jpg"}
                width={'100%'}

            />
            <CardContent>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography gutterBottom variant="h6" component="div">
                        盲盒
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {weiToEth(item.currentPrice)} eth
                    </Typography>
                </Stack>

                <Rating name="read-only" value={rate} readOnly/>
            </CardContent>
            <CardActions>
                <Button variant={"contained"} size={"small"} onClick={() => enqueueSnackbar(`开发中...`)}>购买</Button>
            </CardActions>
        </CustomCard>
    }, [enqueueSnackbar])
    const gridItemRender = useCallback((item: IChainItem) => {
        const rateNum = Number.parseInt(item.quality || '1');
        const rate = rateNum == 0 ? 1 : rateNum;
        return <Grid item={true} key={`${item.tokenUri}${item.tokenId}${item.quality}${item.creator}`} xs={12}
                     sm={4} md={3}>
            <CustomCard elevation={0} variant={'outlined'}>
                <CardMedia
                    component="img"
                    alt="green iguana"
                    image={"http://172.24.135.32:3080/static/img/mintBox.jpg"}
                />
                <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography gutterBottom variant="h6" component="div">
                            盲盒
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {weiToEth(item.currentPrice)} eth
                        </Typography>
                    </Stack>

                    <Rating name="read-only" value={rate} readOnly/>
                </CardContent>
                <CardActions>
                    <Button
                        variant={"contained"}
                        size={"small"}
                        onClick={() => enqueueSnackbar(`开发中...`)}
                    >购买</Button>
                </CardActions>
            </CustomCard>
        </Grid>

    }, [enqueueSnackbar])
    const blindBoxList = useMemo(() => {
        if(loading){
            return ;
        }
        if(list.length==0){
            return  <Box minHeight={160} display={"flex"} alignItems={"center"} justifyContent={"center"}><Typography color={theme=>theme.palette.text.primary} variant={'h6'} textAlign={"center"}>
                暂无项目
            </Typography>
            </Box>
        }
        if (arrangement == EArrangement.GRID) {
            return <Grid container spacing={2} columns={12}>
                {list?.map(gridItemRender)}
            </Grid>
        } else if (arrangement == EArrangement.MASONRY) {
            return <Masonry columns={{xs: 1, sm: 3, md: 4}} spacing={2}>
                {list.map(masonryItemRender)}
            </Masonry>
        }
    }, [arrangement, gridItemRender, list, loading, masonryItemRender])
    return <Box marginTop={3}>
        <Typography color={theme=>theme.palette.text.primary} variant={'h4'} fontWeight={"bold"}>
            盲盒
        </Typography>
        <Divider sx={{marginBottom:3}}/>
        {blindBoxList}
    </Box>
}
export  default  BlindBox;
