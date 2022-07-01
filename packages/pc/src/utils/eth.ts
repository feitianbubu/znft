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
