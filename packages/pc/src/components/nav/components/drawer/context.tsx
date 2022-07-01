import React, {PropsWithChildren, useCallback, useContext} from "react";
type IDrawerState = { visible:boolean }
type IAction = {
    type: 'change',
    value: IDrawerState
}

export const drawerStateContextReducer: (drawerState: IDrawerState, action: IAction) => IDrawerState = (drawerState, action) => {
    if (action.type == 'change') {
        return {
            ...drawerState,
            ...action.value
        };
    } else {
        return drawerState
    }
};
export const drawerStateContextDefaultValue: IDrawerState = {
    visible:false,
};
const DrawerStateContext = React.createContext<{ drawerState:IDrawerState, dispatch: React.Dispatch<IAction> }>({
    drawerState: drawerStateContextDefaultValue, dispatch: () => {
        //
    },
});
export const DrawerStateContextProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const [drawerState, dispatch] = React.useReducer(drawerStateContextReducer, drawerStateContextDefaultValue);
    const value = React.useMemo(()=>({
        drawerState,
        dispatch,
    }), [drawerState]);
    return <DrawerStateContext.Provider value={value}>{props.children}</DrawerStateContext.Provider>;
};
export default DrawerStateContextProvider;

export const useDrawerState:()=>[IDrawerState,(drawerState:IDrawerState)=>void] = ()=>{
    const {drawerState,dispatch} = useContext(DrawerStateContext);
    const handleChange = useCallback((drawerState:IDrawerState)=>{
        dispatch({
            type:'change',
            value:drawerState
        })
    },[dispatch])
    return [drawerState,handleChange]
}
