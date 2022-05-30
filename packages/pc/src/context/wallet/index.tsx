import * as React from 'react';
import {PropsWithChildren, useCallback} from 'react';
import Provider from "@/pc/instance/provider";
import {ACCOUNTS_CHANGED, CHAIN_CHANGED} from "@/pc/constant";
import {ethers} from "ethers";
import {useMount} from "@lib/react-hook";
type IAction = {
    type: 'change',
    value: { [key: string]: string }
}
export const walletReducer: (state: { [key: string]: string }, action: IAction) => { [key: string]: string } = (state, action) => {
    if (action.type == 'change') {
        return {...state, ...action.value};
    } else{
        return  state
    }
};
export const walletDefaultValue: { [key: string]: string } = ({});
export const WalletContext = React.createContext<{ [key: string]: string }>({});

export const WalletProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const [state, dispatch] = React.useReducer(walletReducer, walletDefaultValue);
    const handleChange = useCallback(async (provider:ethers.providers.Web3Provider)=>{
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance= await provider.getBalance(address);
        const chainId = await signer.getChainId();
        dispatch({
            type:'change',
            value:{address,balance:ethers.utils.formatEther(balance),chainId:chainId.toString()}
        })
    },[])
    // typeof CHAIN_CHANGED|typeof ACCOUNTS_CHANGED
    Provider.subscribers(CHAIN_CHANGED,"context",handleChange)
    Provider.subscribers(ACCOUNTS_CHANGED,"context",handleChange);
    const init = useCallback(async ()=>{
        const provider = await Provider.getInstance();
        if(provider){
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const balance= await provider.getBalance(address);
            const chainId = await signer.getChainId();
            dispatch({
                type:'change',
                value:{address,balance:ethers.utils.formatEther(balance),chainId:chainId.toString()}
            })
        }
    },[])
    useMount(()=>{
        init().then()
    })
    return <WalletContext.Provider value={state}>{props.children}</WalletContext.Provider>;
};
export default WalletProvider;

export const useWallet= () => {
    return  React.useContext(WalletContext);
};

