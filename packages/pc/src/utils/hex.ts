import { BigNumber, ethers } from "ethers";

export const numToHex = (num?: number) => {
    if (num == undefined || num == null) {
        return
    }
    if (isNaN(num)) {
        return
    }
    return `0x${num.toString(16)}`
}
export const bnStrToHex = (str?: string) => {
    if (!str) {
        return;
    }
    try{
        return BigNumber.from(str).toHexString();
    }catch(e){
        return;
    }
}

export const strToHex = (str?: string) => {
    if (!str) {
        return;
    }
    try {
        return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
    } catch (error) {
        return;
    }
}
