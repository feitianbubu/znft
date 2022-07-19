import * as React from 'react';
import {FormControl, FormControlLabel, Radio as MRadio, RadioGroup, FormLabel, FormControlLabelProps} from '@mui/material';
import {RadioProps} from './interface';
import {PropsWithChildren, useCallback, useMemo, useState} from 'react';

export const RadioItem:React.FC<Required<Pick<FormControlLabelProps, 'value'>>& Omit<FormControlLabelProps, 'control'>&{key:string|number}> = (props)=>{
  return <FormControlLabel {...props} control={<MRadio />}/>;
};
export const Radio :React.FC<PropsWithChildren<RadioProps>> = (props)=>{
  const {defaultValue, value, onChange, children, label, ...others} = props;
  const [_value, set_value] = useState(defaultValue||'');
  const memoValue = useMemo(()=>{
    return value||_value;
  }, [_value, value]);
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, value:string) => {
    set_value(value);
    onChange?.(event, value);
  }, [onChange]);

  return <FormControl fullWidth={true}>
    <FormLabel>{label}</FormLabel>
    <RadioGroup
      {...others}
      defaultValue={defaultValue}
      value={memoValue}
      onChange={handleChange}
    >
      {children}
    </RadioGroup>
  </FormControl>;
};
export default Radio;
