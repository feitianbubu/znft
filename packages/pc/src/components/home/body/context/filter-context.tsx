import * as React from 'react';
import {PropsWithChildren, useCallback} from 'react';
import {EFilter} from "@/pc/constant/enum";

type IAction = {
    type: 'change',
    value: IState
}
type IState = { value:string,loading:boolean }
export const filterContextReducer: (state: IState, action: IAction) => IState = (state, action) => {
    if (action.type == 'change') {
        return {
            ...state,
            ...action.value
        };
    } else {
       return state
    }
};
export const filterContextDefaultValue: IState = {
    value:EFilter.市场,
    loading:false,
};
export const FilterContextContext = React.createContext<{ state:IState, dispatch: React.Dispatch<IAction> }>({
    state:  {
        value:EFilter.市场,
        loading:false,
    }, dispatch: () => {
        //
    },
});

export const FilterContextProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const [state, dispatch] = React.useReducer(filterContextReducer, filterContextDefaultValue);
    const value = React.useMemo(()=>({
        state,
        dispatch,
    }), [state]);
    return <FilterContextContext.Provider value={value}>{props.children}</FilterContextContext.Provider>;
};
export default FilterContextProvider;

export const useFilter:() => [string, (value:string) => void,boolean, (value:boolean) => void] = () => {
    const {state, dispatch} = React.useContext(FilterContextContext);
   const setValue = useCallback((value:string)=>{
       dispatch({
           type:'change',
           value:{...state,value:value},
       })
   },[dispatch, state])
    const setLoading = useCallback((loading:boolean)=>{
        dispatch({
            type:'change',
            value:{...state,loading:loading},
        })
    },[dispatch, state])
    return [state.value, setValue,state.loading,setLoading];
};

