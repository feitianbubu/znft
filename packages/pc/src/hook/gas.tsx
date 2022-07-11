import {useCallback, useEffect, useState} from "react";
import {guessGasLimit, guessGasPrice} from "@/pc/utils/eth";
import {useLoading} from "@lib/react-hook";
import {TransactionRequest} from "@ethersproject/abstract-provider/src.ts/index";

export const useReferencePrice:()=>[string,boolean,()=>Promise<void>] = ()=>{
    const [referencePrice,setReferencePrice] = useState("")
    const [load,loading] = useLoading(guessGasPrice)
    const guess = useCallback(async ()=>{
        const res = await load();
        console.log('guess',res)
        if(res){
            setReferencePrice(res)
        }
    },[load])
    useEffect(()=>{
        guess().then()
    },[guess])
    return [referencePrice,loading,guess]
}
export const useReferenceLimit:()=>[string,boolean,(request?:TransactionRequest)=>Promise<void>] = ()=>{
    const [referencePrice,setReferencePrice] = useState("")
    const [load,loading] = useLoading(guessGasLimit)
    const guess = useCallback(async (request?:TransactionRequest)=>{
        const res = await load(request);
        if(res){
            setReferencePrice(res)
        }
    },[load])
    useEffect(()=>{
        guess().then()
    },[guess])
    return [referencePrice,loading,guess]
}
