import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useWallet} from "@/pc/context/wallet";
import {IMockChain, mockChains} from "@/pc/mock/chains";
import {useContract} from "@/pc/context/contract";
import {IChainContractConfig} from "@/pc/services/contract";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import {numToHex} from "@/pc/utils/hex";
import {switchMetamaskChain} from "@/pc/utils/metamask";
import {useMount} from "@lib/react-hook";

export const SwitchChain: React.FC = () => {
    const [wallet] = useWallet();
    const {chainId, isConnected} = wallet;
    const ref = useRef<{ [key: number]: IMockChain }>({})
    const mockFunc = useCallback(() => {
        for (const mockChain of mockChains) {
            ref.current[mockChain.chainId] = mockChain
        }
    }, [])
    const [contract] = useContract();
    const {data: contractMap, loading: loadChainLoading} = contract
    const [value, setValue] = useState(chainId && contractMap[chainId] ? contractMap : '');
    const list = useMemo(() => {
        const list: (IChainContractConfig & { chainId: string })[] = []
        for (const chainsKey in contractMap) {
            if (contractMap.hasOwnProperty(chainsKey)) {
                list.push({
                    ...contractMap[chainsKey],
                    chainId: chainsKey
                })
            }
        }
        return list.map((item) => {
            return <MenuItem key={item.chainId} value={item.chainId}>{item.Name}</MenuItem>
        })
    }, [contractMap])
    const handleChange = useCallback(async (event: SelectChangeEvent<unknown>) => {
        const chainId = event.target.value as string;
        try {
            const num = Number.parseInt(chainId);
            const all = ref.current[num]
            let op: { chainId: string, chainName: string, rpcUrls: string[] } | null;
            if (num == 31337) {
                op = {
                    chainId: numToHex(num),
                    chainName: 'hardhat',
                    rpcUrls: ['https://hardhat.tevat.dev/']
                }

            } else {
                op = {
                    chainId: numToHex(all.chainId),
                    chainName: all.name,
                    rpcUrls: all.rpc
                }
            }

            await switchMetamaskChain(numToHex(num), op as { chainId: string, chainName: string, rpcUrls: string[] });
        } catch (e) {
            console.log(e)
            return;
        }

        setValue(event.target.value as string);
    }, [])
    useEffect(() => {
        if (chainId) {
            if (contractMap[chainId]) {
                setValue(chainId)
            } else {
                setValue('')
            }

        }
    }, [chainId, contractMap])
    useMount(() => {
        mockFunc()
    })
    return  <Box minWidth={200}>
        <FormControl size={"small"} fullWidth>
            <InputLabel>切换已支持的链</InputLabel>
            <Select
                fullWidth={true}
                value={value}
                onChange={handleChange}
                size={"small"}
                label="切换已支持的链" // add this
                disabled={loadChainLoading}
            >
                {list}
            </Select>
        </FormControl>
    </Box>
}
export default SwitchChain;
