import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {getHeroClockAction} from "@/pc/services/contract";

type  IState = {
    loading: boolean
    abi?: ContractInterface
}
type IAction = {
    type: 'change',
    value: Partial<IState>
}
export const auctionAbiReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return {
            ...state,
            ...action.value
        };
    } else {
        return state
    }
};
export const auctionAbiDefaultValue: IState = {
    loading: true
};
export const AuctionAbiContext = React.createContext<{ state: IState, dispatch: React.Dispatch<IAction> }>({
    state: auctionAbiDefaultValue, dispatch: () => {
        //
    },
});
export const AuctionAbiProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    const [state, dispatch] = React.useReducer(auctionAbiReducer, auctionAbiDefaultValue);
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
        const abi = await getHeroClockAction();
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
    return <AuctionAbiContext.Provider value={value}>
        {children}
    </AuctionAbiContext.Provider>
}
export default AuctionAbiProvider;

export const useAuctionAbi: () => [IState] = () => {
    const {state} = React.useContext(AuctionAbiContext);
    return [state]
}
