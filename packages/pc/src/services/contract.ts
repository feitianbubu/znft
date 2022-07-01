import {Http} from "@lib/service";
import {contract, HERO_CLOCK_AUCTION, HERO_CORE, MIN_BOX, PRE_SALE} from "@/pc/constant";
import {ContractInterface} from "@ethersproject/contracts/src.ts";

export const getHeroCore = ()=>{
    const url  = process.env.NEXT_PUBLIC_STATIC_ABI_URL;
    return Http.static<ContractInterface>(`${url}${contract[HERO_CORE]}`)
}
export const getHeroClockAction = ()=>{
    const url  = process.env.NEXT_PUBLIC_STATIC_ABI_URL;
    return Http.static<ContractInterface>(`${url}${contract[HERO_CLOCK_AUCTION]}`)
}
export const getMinBox = ()=>{
    const url  = process.env.NEXT_PUBLIC_STATIC_ABI_URL;
    return Http.static<ContractInterface>(`${url}${contract[MIN_BOX]}`)
}
export const getPreSale = ()=>{
    const url  = process.env.NEXT_PUBLIC_STATIC_ABI_URL;
    return Http.static<ContractInterface>(`${url}${contract[PRE_SALE]}`)
}
export interface IChainContractConfig {
    AuctionContractAddress: string
    HeroContractAddress: string
    MintBoxContractAddress: string
    PreSaleContractAddress:string,
    Name: string
    RefreshInterval: number
    Rowurl: string
    Symbol: string
}
export type IChainContractConfigMap = {[key:string]:IChainContractConfig}
export interface IConfig{
    Chain:IChainContractConfigMap,
    CommitID:string,
    Version:string
}
export const getChainConfig = ()=>{
    return Http.post<IConfig>(`${process.env.NEXT_PUBLIC_API_URL}/Config`,{})
}
export interface IChainItem{
    currentPrice: string
    owner: string
    quality?: string
    seller: string
    tokenId: string
    tokenUri?: string
    creator?:string
    num?:string,
    preSale?: {startTime: string, endTime: string}
}
export interface IChainItemListRequest{
    chainID: string
    owner: string
}
export interface IChainItemListResponse{
    nonce:number,
    items:IChainItem[]
}
export const getNFTList = (params?:IChainItemListRequest)=>{
    return Http.post<IChainItemListResponse>(`${process.env.NEXT_PUBLIC_API_URL}/ItemList`,params)
}
