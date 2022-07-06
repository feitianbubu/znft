import {Http} from "@lib/service";

const VERSION = 'v1'
export interface IHeroInfo{
    // "tokenId": string,
    "code": number,
    "currHp": number,
    "quantity": number,
    "level": number,
    "power": number
}
export interface IMintRequest {
    "to":string,
    "tokenType": string,
    "tokenCode": string,
    "chainID": string,
    "rawTx": string,
    "heroInfo": IHeroInfo
}
export const mint = (params:IMintRequest)=>{
    const url = `/${VERSION}/mint`;
    return Http.post(url,params)
}