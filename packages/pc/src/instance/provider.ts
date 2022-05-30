import {ethers} from "ethers";
import {ACCOUNTS_CHANGED, CHAIN_CHANGED, ETH_REQUEST_ACCOUNTS} from "@/pc/constant";

export  class  Provider {
    private static provider:ethers.providers.Web3Provider;
    private static event:{[key:string]:{[key:string]:(provider:ethers.providers.Web3Provider)=>Promise<void>}}  = {[CHAIN_CHANGED]:{},[ACCOUNTS_CHANGED]:{}}
    public static getInstance =async ()=>{
        if(Provider.provider){
            return Provider.provider
        }else{
            const ethereum = (window as any).ethereum
            if (ethereum) {
                // todo 这里加个any可以复用 provider 不加则是切换的时候也要重新new一个provider 因为锁定了network 暂时没发现坑 有坑要切换单例模式的设计
                const provider = new ethers.providers.Web3Provider(ethereum, 'any');
                try {
                    await Provider.refreshInfoFromMetamask(provider)
                }catch (e) {
                    return
                }
                Provider.addListener()
                Provider.provider = provider;
                return  provider;
            }

        }
    }
    public static resetInstance = async ()=>{
        const ethereum = (window as any).ethereum
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            try {

                await Provider.refreshInfoFromMetamask(provider)
            }catch (e) {
                return
            }
            Provider.addListener()
            Provider.provider = provider;
            return  provider;
        }
    }
    private static refreshInfoFromMetamask = (provider:ethers.providers.Web3Provider = Provider.provider) => {
        return new Promise((resolve,reject)=>{
            try {
                provider.send(ETH_REQUEST_ACCOUNTS, [])
                    .then((address)=>{
                    resolve(address)
                });
                // console.log( provider.getSigner().getChainId().then(console.log))
            }catch (e: any) {
                // { code:number,message:string,stack:string }
                // todo 尚不明确错误判断规则
                if(e.code>0){
                    reject(e.message)
                }
            }
        })

    };

    public static subscribers = (type: typeof CHAIN_CHANGED|typeof ACCOUNTS_CHANGED,key:string,func:(provider:ethers.providers.Web3Provider)=>Promise<void>) => {
       Provider.event[type][key] = func
    };
    public static unSubscribers = (type: typeof CHAIN_CHANGED|typeof ACCOUNTS_CHANGED,key:string) => {
       delete Provider.event[type][key]
    };
    private static handleChainChange = async ()=>{
        await Provider.refreshInfoFromMetamask()
        const map = Provider.event[CHAIN_CHANGED];
        for (const mapKey in map) {
            if(map.hasOwnProperty(mapKey)){
                map[mapKey](Provider.provider)
            }
        }

    }
    private static handleAccountChange = async ()=>{
        await Provider.refreshInfoFromMetamask()
        const map = Provider.event[ACCOUNTS_CHANGED];
        for (const mapKey in map) {
            if(map.hasOwnProperty(mapKey)){
                map[mapKey](Provider.provider)
            }
        }
    }
    public static addListener = ()=>{
        const ethereum = (window as any).ethereum
        if (ethereum) {
            ethereum.removeListener(CHAIN_CHANGED, Provider.handleChainChange);
            ethereum.removeListener(ACCOUNTS_CHANGED, Provider.handleAccountChange);
            ethereum.on(CHAIN_CHANGED, Provider.handleChainChange);
            ethereum.on(ACCOUNTS_CHANGED, Provider.handleAccountChange);
        }
    }
}
export default Provider;
