import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import {IChainContractConfigMap, IChainContractConfig} from "@/pc/services/contract";
import {IMockChain, mockChains} from "@/pc/mock/chains";
import {numToHex} from "@/pc/utils/hex";
import {switchMetamaskChain} from "@/pc/utils/metamask";
import {useMount} from "@lib/react-hook";
import {useWallet} from "@/pc/context/wallet";
import Round from "@lib/react-component/es/round";
import {RadioButton, RadioButtonItem} from "@lib/react-component";
import {EArrangement} from "@/pc/components/market";

const SubNav: React.FC<{ contractMap: IChainContractConfigMap, loadChainLoading?: boolean, loadNFTListLoading?: boolean, status: null | 'error' | 'waring' | 'success' | 'chainNotSupport', arrangement: EArrangement.GRID | EArrangement.MASONRY, onArrangementChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, value?: string) => void }> = (props) => {
    const {contractMap, loadChainLoading, loadNFTListLoading, status, arrangement, onArrangementChange} = props;
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
    return <Box height={48} display={"flex"} minWidth={520} justifyContent={"space-between"}>
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
            <SwitchChain chains={contractMap} loading={loadChainLoading}/>
        </Stack>
    </Box>
}
export default SubNav

const SwitchChain: React.FC<{ chains: IChainContractConfigMap, loading?: boolean }> = (props) => {
    const [wallet] = useWallet();
    const {chainId} = wallet;
    const ref = useRef<{ [key: number]: IMockChain }>({})
    const mockFunc = useCallback(() => {
        for (const mockChain of mockChains) {
            ref.current[mockChain.chainId] = mockChain
        }
    }, [])
    const {chains, loading} = props;
    const [value, setValue] = useState(chainId && chains[chainId] ? chains : '');
    const list = useMemo(() => {
        const list: (IChainContractConfig & { chainId: string })[] = []
        for (const chainsKey in chains) {
            if (chains.hasOwnProperty(chainsKey)) {
                list.push({
                    ...chains[chainsKey],
                    chainId: chainsKey
                })
            }
        }
        return list.map((item) => {
            return <MenuItem key={item.chainId} value={item.chainId}>{item.Name}</MenuItem>
        })
    }, [chains])
    const handleChange = useCallback(async (event: SelectChangeEvent<unknown>) => {
        const chainId = event.target.value as string;
        try {
            const num = Number.parseInt(chainId);
            const all = ref.current[num]
            const op = {
                chainId: numToHex(all.chainId),
                chainName: all.name,
                rpcUrls: all.rpc
            }
            await switchMetamaskChain(numToHex(num), op);
        } catch (e) {
            console.log(e)
            return;
        }

        setValue(event.target.value as string);
    }, [])
    useEffect(() => {
        if (chainId ) {
            if(chains[chainId]){
                setValue(chainId)
            }else{
                setValue('')
            }

        }
    }, [chainId, chains])
    useMount(() => {
        mockFunc()
    })
    return <Box minWidth={200}><FormControl size={"small"} fullWidth>
        <InputLabel>切换已支持的链</InputLabel>
        <Select
            fullWidth={true}
            value={value}
            onChange={handleChange}
            size={"small"}
            label="切换已支持的链" // add this
            disabled={loading}
        >
            {list}
        </Select>
    </FormControl>
    </Box>
}
