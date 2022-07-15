import { ethers } from "ethers";

export const numToHex = (num?: number) => {
    if (num == undefined || num == null) {
        return
    }
    if (isNaN(num)) {
        return
    }
    return `0x${num.toString(16)}`
}
export const strToHex = (str?: string) => {
    if (!str) {
        return;
    }

    const _n = Number.parseInt(str)
    if (isNaN(_n)) {
        return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
    } else {
        return `0x${_n.toString(16)}`
    }

}
