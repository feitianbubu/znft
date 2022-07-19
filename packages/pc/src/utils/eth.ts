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
export const weiToGwei = (wei?:string,type?:'up'|'down')=>{
    console.log('a',wei)
    if(!wei){
        return  '0'
    }
    try {
        const gwei = ethers.utils.formatUnits(wei,'gwei')
        if(type){
            if(type=='up'){
               
                const [v] = gwei.split('.')
                const _v = BigNumber.from(v)
                return _v.add(1).toString();
            }else{
                const [v] = gwei.split('.')
                return v
            }
        }else{
            return gwei
        }
       
    }catch (e) {
        console.log(e)
        return '0'
    }

}
// 仅支持整数gwei
export const gweiToWei = (gwei?:string)=>{
    if(!gwei){
        return  '0'
    }
    try {
        const [int,flat] = gwei.split('.');
        const bn = BigNumber.from(int)
        const _flat = flat?flat.padEnd(9,'0'):'0'.padEnd(9,'0')
        console.log(bn.toString(),_flat.toString())
       return bn.mul(1000000000).add(BigNumber.from(_flat)).toString()
    }catch (e) {
        console.log(e)
        return '0'
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
            return bnToWei(bn.mul(5))
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
            return bnToWei(bn)
        }catch (e) {
            return
        }
    }
}

