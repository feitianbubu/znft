import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {getMintBox} from "@/pc/services/contract";

type  IState = {
    loading: boolean
    abi?: ContractInterface
}
type IAction = {
    type: 'change',
    value: Partial<IState>
}
export const mintBoxAbiReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return {
            ...state,
            ...action.value
        };
    } else {
        return state
    }
};
export const mintBoxAbiDefaultValue: IState = {
    loading: true
};
export const MintBoxAbiContext = React.createContext<{ state: IState, dispatch: React.Dispatch<IAction> }>({
    state: mintBoxAbiDefaultValue, dispatch: () => {
        //
    },
});
export const MintBoxAbiProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    const [state, dispatch] = React.useReducer(mintBoxAbiReducer, mintBoxAbiDefaultValue);
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
        const abi = await getMintBox();
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
    return <MintBoxAbiContext.Provider value={value}>
        {children}
    </MintBoxAbiContext.Provider>
}
export default MintBoxAbiProvider;

export const useMintBoxAbi: () => [IState] = () => {
    const {state} = React.useContext(MintBoxAbiContext);
    return [state]
}
