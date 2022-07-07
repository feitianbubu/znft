import React, {useMemo} from "react";
import {
    Box,
    CircularProgress,
    Stack,
    Typography
} from "@mui/material";
import {useWallet} from "@/pc/context/wallet";
import Round from "@lib/react-component/es/round";
import {RadioButton, RadioButtonItem} from "@lib/react-component";
import {EArrangement} from "@/pc/components/market";
import {useContract} from "@/pc/context/contract";
import SwitchChain from "@/pc/components/switchChain";

const SubNav: React.FC<{  loadNFTListLoading?: boolean, status: null | 'error' | 'waring' | 'success' | 'chainNotSupport', arrangement: EArrangement.GRID | EArrangement.MASONRY, onArrangementChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, value?: string) => void }> = (props) => {
    const { loadNFTListLoading, status, arrangement, onArrangementChange} = props;
    const [contract] = useContract();
    const {loading:loadChainLoading} = contract
    const [wallet] = useWallet();
    const {isConnected} = wallet;
    const light = useMemo(() => {
        if (!isConnected) {
            return <Round color={'error'}/>;
        }
        if (loadChainLoading || loadNFTListLoading) {
            return <CircularProgress size={10} sx={{
                color: theme => theme.palette.text.primary
            }}/>
        }

        switch (status) {
            case 'error':
                return <Round color={'error'}/>;
            case 'chainNotSupport':
                return <Round color={'error'}/>;
            case 'success':
                return <Round color={'success'}/>;
            case 'waring':
                return <Round color={'waring'}/>;
        }
    }, [isConnected, loadChainLoading, loadNFTListLoading, status])
    const statusMessage = useMemo(() => {
        if (!isConnected) {
            return "尚未链接到钱包"
        }
        if (loadChainLoading) {
            return "正在检测市场是否支持当前网络"
        }
        if (loadNFTListLoading) {
            return "正在获取获取NFT"
        }
        if (status == 'chainNotSupport') {
            return '市场不支持当前网络'
        }
        if (status == 'success') {
            return '已链接'
        }
    }, [isConnected, loadChainLoading, loadNFTListLoading, status])
    return <Box height={48} display={"flex"} justifyContent={"space-between"} marginTop={3} marginBottom={3}>
        <Box>
            <RadioButton
                onChange={onArrangementChange}
                sx={{justifyContent: 'center'}}
                value={arrangement}
            >
                <RadioButtonItem key={EArrangement.GRID} value={EArrangement.GRID}>
                    网格布局
                </RadioButtonItem>
                <RadioButtonItem key={EArrangement.MASONRY} value={EArrangement.MASONRY}>
                    流式布局
                </RadioButtonItem>
            </RadioButton>
        </Box>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
            {light}
            <Box>
                <Typography color={theme => theme.palette.text.primary} whiteSpace={"nowrap"}>
                    {statusMessage}
                </Typography>
            </Box>
            <SwitchChain/>
        </Stack>
    </Box>
}
export default SubNav
