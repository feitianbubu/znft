import * as React from 'react';
import {FormControl, FormControlLabel, Radio as MRadio, RadioGroup as MRadioGroup, styled} from '@mui/material';
import {RadioProps} from './interface';
import {useCallback, useMemo, useState} from 'react';
const F= styled(FormControl)({
  width: '100%',
});
const M = styled(MRadioGroup)({
  width: '100%',
});
const FL = styled(FormControlLabel)({
  justifyContent: 'space-between',
});
const render = (item:{label:string, value:string, disabled?:boolean, labelPlacement?:'end' | 'start' | 'top' | 'bottom' })=>{
  return <FL value={item.value} key={item.value} labelPlacement={item.labelPlacement} control={<MRadio />} label={item.label} disabled={item.disabled} />;
};
export const Radio :React.FC<RadioProps> = (props)=>{
  const {defaultValue, value, onChange, list, disabled} = props;
  const [_value, set_value] = useState(defaultValue||'');
  const memoValue = useMemo(()=>{
    return value||_value;
  }, [_value, value]);
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    set_value(value);
    onChange?.(value);
  }, [onChange]);
  const _list = useMemo(()=>{
    return list.map((item)=>{
      return {
        disabled: disabled,
        ...item,
      };
    }, []);
  }, [disabled, list]);
  return <F>
    <M

      defaultValue={defaultValue}
      value={memoValue}
      onChange={handleChange}
    >
      {_list.map(render)}
    </M>
  </F>;
};
export default Radio;
