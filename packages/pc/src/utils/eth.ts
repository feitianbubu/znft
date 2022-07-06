import {ethers} from "ethers";

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
        return ethers.utils.formatUnits(bn,'wei')
    }catch (e) {
        return '0'
    }

}
