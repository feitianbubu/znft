import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import {getHeroCore} from "@/pc/services/contract";

type  IState = {
    loading: boolean
    abi?: ContractInterface
}
type IAction = {
    type: 'change',
    value: Partial<IState>
}
export const heroAbiReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return {
            ...state,
            ...action.value
        };
    } else {
        return state
    }
};
export const heroAbiDefaultValue: IState = {
    loading: true
};
export const HeroAbiContext = React.createContext<{ state: IState, dispatch: React.Dispatch<IAction> }>({
    state: heroAbiDefaultValue, dispatch: () => {
        //
    },
});
export const HeroAbiProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    const [state, dispatch] = React.useReducer(heroAbiReducer, heroAbiDefaultValue);
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
        const abi = await getHeroCore();
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
    return <HeroAbiContext.Provider value={value}>
        {children}
    </HeroAbiContext.Provider>
}
export default HeroAbiProvider;

export const useHeroAbi: () => [IState] = () => {
    const {state} = React.useContext(HeroAbiContext);
    return [state]
}
