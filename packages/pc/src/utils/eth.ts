import {BigNumber, ethers} from "ethers";
import Provider from "@/pc/instance/provider";
import {TransactionRequest} from "@ethersproject/abstract-provider/src.ts/index";
export  const bnToWei = (bn?:BigNumber)=>{
    if(!bn){
        return "0"
    }else {
        try {
            return ethers.utils.formatUnits(bn,'wei')
        }catch (e) {
            return '0'
        }
    }
}
export const weiToEth = (wei?:string)=>{
    if(!wei){
        return  '0'
    }
    try {
        return ethers.utils.formatEther(wei)
    }catch (e) {
        return '0'
    }

}
export const ethToWei = (eth?:string)=>{
    if(!eth){
        return  '0'
    }
    try {
        const bn = ethers.utils.parseEther(eth)
        return bnToWei(bn)
    }catch (e) {
        return '0'
    }

}

export const guessGasPrice =async ()=>{
    const provider = await Provider.getInstance();
    if(provider){
        const bn = await  provider.getGasPrice();
        try {
            // todo
            return bnToWei(bn.mul(10))
        }catch (e) {
            return
        }
    }
}
export const guessGasLimit =async (request?:TransactionRequest)=>{
    const provider = await Provider.getInstance();
    if(provider&&request){
        console.log(provider)
        const bn = await  provider.estimateGas(request)
        try {
            // todo
            return bnToWei(bn.mul(10))
        }catch (e) {
            return
        }
    }
}

