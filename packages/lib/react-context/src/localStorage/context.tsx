import * as React from 'react';
import {PropsWithChildren} from 'react';

type IAction = {
    type: 'add',
    value: { [key: string]: string }
} | {
    type: 'remove',
    key: string
}| {
    type: 'init',
    value: { [key: string]: string }
}
export const localStorageReducer: (state: { [key: string]: string }, action: IAction) => { [key: string]: string } = (state, action) => {
  if (action.type == 'add') {
    return {...state, ...action.value};
  } else if (action.type=='init') {
    return {...action.value};
  } else {
    const nextState = {...state};
    delete nextState[action.key];
    return nextState;
  }
};
export const localStorageDefaultValue: { [key: string]: string } = JSON.parse(JSON.stringify(globalThis?.localStorage||{}));
export const LocalStorageContext = React.createContext<{ state: { [key: string]: string }, dispatch: React.Dispatch<IAction> }>({
  state: {}, dispatch: () => {
    //
  },
});

export const LocalStorageProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
  const [state, dispatch] = React.useReducer(localStorageReducer, localStorageDefaultValue);
  const value = React.useMemo(()=>({
    state,
    dispatch,
  }), [state]);
  return <LocalStorageContext.Provider value={value}>{props.children}</LocalStorageContext.Provider>;
};
export default LocalStorageProvider;

export const useLocalStorage: <R>(key: string, defaultValue?:R) => [R, (key: R) => void, () => void] = (key, defaultValue) => {
  const {state, dispatch} = React.useContext(LocalStorageContext);
  const setLocalStorage = React.useCallback((_value:unknown) => {
    const __value = typeof _value=='string'?_value:typeof _value=='number'?_value.toString():JSON.stringify(_value);
    dispatch({type: 'add', value: {[key]: __value}});
    globalThis?.localStorage?.setItem(key, __value);
  }, [key, dispatch]);
  const removeLocalStorage = React.useCallback(() => {
    dispatch({type: 'remove', key});
    globalThis?.localStorage?.removeItem(key);
  }, [key, dispatch]);
  let value;
  if (state[key]) {
    try {
      value = JSON.parse(state[key]);
    } catch (e) {
      value = state[key];
    }
  } else {
    value = defaultValue;
  }

  return [value, setLocalStorage, removeLocalStorage];
};

