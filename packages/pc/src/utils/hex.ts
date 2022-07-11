import {ethers} from "ethers";

export const numToHex = (num:number)=>{
    return `0x${num.toString(16)}`
}
export const strToHex = (str?:string)=>{
    if(str){
        return  ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
    }
}
