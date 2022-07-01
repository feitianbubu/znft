import * as React from 'react';
import {
  FormControl,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup, ToggleButtonProps,
} from '@mui/material';
import {RadioButtonProps} from './interface';
import {PropsWithChildren, useCallback, useMemo, useState} from 'react';

export const RadioButtonItem:React.FC<ToggleButtonProps&{key:string|number}> = (props)=>{
  return <ToggleButton {...props}/>;
};
export const RadioButton :React.FC<PropsWithChildren<RadioButtonProps>> = (props)=>{
  const {defaultValue, value, onChange, children, label, ...others} = props;
  const [_value, set_value] = useState<string|number>(defaultValue||'');
  const memoValue = useMemo(()=>{
    return value||_value;
  }, [_value, value]);
  const handleChange = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, value:string|number) => {
    set_value(value);
    onChange?.(event, value);
  }, [onChange]);

  return <FormControl fullWidth={true}>
    <FormLabel>{label}</FormLabel>
    <ToggleButtonGroup
      {...others}
      defaultValue={defaultValue}
      value={memoValue}
      onChange={handleChange}
      exclusive={true}
    >
      {children}
    </ToggleButtonGroup>
  </FormControl>;
};
export default RadioButton;
