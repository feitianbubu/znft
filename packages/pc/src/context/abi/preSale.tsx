import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {getPreSale} from "@/pc/services/contract";

type  IState = {
    loading: boolean
    abi?: ContractInterface
}
type IAction = {
    type: 'change',
    value: Partial<IState>
}
export const preSaleAbiReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return {
            ...state,
            ...action.value
        };
    } else {
        return state
    }
};
export const preSaleAbiDefaultValue: IState = {
    loading: true
};
export const PreSaleAbiContext = React.createContext<{ state: IState, dispatch: React.Dispatch<IAction> }>({
    state: preSaleAbiDefaultValue, dispatch: () => {
        //
    },
});
export const PreSaleAbiProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    const [state, dispatch] = React.useReducer(preSaleAbiReducer, preSaleAbiDefaultValue);
    const value = React.useMemo(() => ({
        state,
        dispatch,
    }), [state]);
    const init = useCallback(async () => {
        dispatch({
            type: 'change',
            value: {
                loading: true
            }
        })
        const abi = await getPreSale();
        if (abi) {
            dispatch({
                type: 'change',
                value: {
                    loading: false,
                    abi
                }
            })
        } else {
            dispatch({
                type: 'change',
                value: {
                    loading: false
                }
            })
        }
    }, [])

    useEffect(() => {
        init().then()
    }, [init])
    return <PreSaleAbiContext.Provider value={value}>
        {children}
    </PreSaleAbiContext.Provider>
}
export default PreSaleAbiProvider;

export const usePreSaleAbi: () => [IState] = () => {
    const {state} = React.useContext(PreSaleAbiContext);
    return [state]
}
