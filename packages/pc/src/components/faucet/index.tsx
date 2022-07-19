import { useWallet } from "@/pc/context/wallet";
import { faucet } from "@/pc/services/restful";
import { ethToWei } from "@/pc/utils/eth";
import { useLoading } from "@lib/react-hook";
import { LoadingButton } from "@mui/lab";
import { Button, Card, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";
import SwitchChain from "../switchChain";
const Faucet: React.FC = () => {
    const [wallet] = useWallet();
    const { enqueueSnackbar } = useSnackbar();
    const [address, setAddress] = useState("")
    const [eth,setEth] = useState(10)
    const { chainId ,isConnected} = wallet;
    const [load, loading] = useLoading(faucet);
    const [wait, setWait] = useState(false);
    const handleClick = useCallback(async () => {
        if(!isConnected){
            enqueueSnackbar("请连接metamask", { variant: 'error' })
            return
        }
        if (!chainId) {
            enqueueSnackbar("尚未选取链", { variant: 'error' })
            return
        }
        setWait(true)
        const res = await load({
            to: address,
            value: ethToWei(`${eth}`),
            chainID: chainId
        })
        if (res) {

            setTimeout(() => {
                setWait(false)
                enqueueSnackbar("等待链上确认", { variant: 'success' })
            }, 1000);
        } else {
            setWait(false)
        }

    }, [chainId, address, enqueueSnackbar,load,eth,isConnected])
    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAddress(e.target.value)
    }, [])
    const handleEthChange = useCallback((e:  SelectChangeEvent<number>) => {
        setEth(typeof e.target.value=='number'?e.target.value:Number.parseInt(e.target.value))
    }, [])
    return <Box minHeight={732} display='flex' justifyContent='center' alignItems={'center'}>
        <Box width={480} height={400}>
            <Card variant='outlined'>
                <Stack spacing={3} padding={3}>
                    <Typography variant="h5" fontWeight={'bold'}>
                        Get Test Eth
                    </Typography>
                    <Typography variant="body1">
                        该水龙头会在链上为您获取一些eth
                    </Typography>
                    <SwitchChain />
                    <FormControl fullWidth>
                        <InputLabel >eth</InputLabel>
                        <Select
                            value={eth}
                            label="eth"
                            onChange={handleEthChange}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={50}>80</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="您的地址" variant="outlined" value={address} onChange={handleAddressChange} />
                    <LoadingButton loading={wait || loading} variant="outlined" onClick={handleClick}>点击获取</LoadingButton>
                </Stack>

            </Card>
        </Box>

    </Box>
}
export default Faucet;