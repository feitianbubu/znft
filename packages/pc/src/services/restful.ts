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
interface  IClearCacheRequest{
    owner:string,
    chainID:string
}
export const clearCache = (params?:IClearCacheRequest)=>{
    const url = `/v1/clearCache`;
    return Http.post<string>(url,params)
}
export interface IBuyTickets {
    "userAddress": string
  "noticeType": number,
  "result": number,
  "txHash": string,
  "productID": string,
  "orderID": string,
  "chainID": string
}
export const buyTickets = (params?:Partial<IBuyTickets>)=>{
    const url = `/v1/pay`;
    return Http.post<string>(url,params)
}
