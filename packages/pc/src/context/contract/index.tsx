import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {getChainConfig, IChainContractConfigMap} from "@/pc/services/contract";
type  IState ={
    loading:boolean
    data:IChainContractConfigMap
}
type IAction = {
    type: 'change',
    value: Partial<IState>
}
export const contractReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return {
            ...state,
            ...action.value
        };
    } else{
        return  state
    }
};
export const contractDefaultValue: IState = {
    loading:true,
    data:{}
};
export const ContractContext = React.createContext<{state:IState, dispatch: React.Dispatch<IAction>}>({
    state: contractDefaultValue, dispatch: () => {
        //
    },
});
export const ContractProvider :React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    const [state, dispatch] = React.useReducer(contractReducer, contractDefaultValue);
    const value = React.useMemo(()=>({
        state,
        dispatch,
    }), [state]);
    const init = useCallback(async () => {
        dispatch({
            type:'change',
            value:{
                loading: true
            }
        })
        const chainConfig = await getChainConfig();
        if (chainConfig) {
            dispatch({
                type:'change',
                value:{
                    loading: false,
                    data: chainConfig?.Chain||{}
                }
            })
        }else{
            dispatch({
                type:'change',
                value:{
                    loading: false
                }
            })
        }
    }, [])

    useEffect(()=>{
        init().then()
    },[init])
    return <ContractContext.Provider value={value}>
        {children}
    </ContractContext.Provider>
}
export default ContractProvider;

export const useContract:()=>[IState] = ()=>{
    const {state} =React.useContext(ContractContext);
    return [state]
}
