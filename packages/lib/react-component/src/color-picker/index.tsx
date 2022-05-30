import * as React from 'react';
import {ColorPickerProps} from './interface';
const {cloneElement, useCallback, useMemo, useRef, useState} = React;
export const ColorPicker:React.FC<ColorPickerProps>=(props)=>{
  const {value, defaultValue, onChange, children} = props;
  const [_value, set_value] = useState<string|undefined>(defaultValue);
  const currentValue = useMemo(()=>value||_value, [value, _value]);
  const handleChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    set_value(e.target.value);
    onChange&&onChange(e.target.value);
  }, [onChange]);
  const display = useMemo(()=>children?{display: 'none'}:{display: 'block'}, [children]);

  const colorRef = useRef<HTMLInputElement>(null);
  const childrenClick = useCallback(()=>{
    colorRef.current?.click();
  }, []);
  const memoChildren = useMemo(()=>children?cloneElement(children, {onClick: childrenClick}):undefined, [children, childrenClick]);
  return <>
    <input ref={colorRef} type={'color'} style={display} value={currentValue} onChange={handleChange}/>
    {memoChildren}
  </>;
};
export default ColorPicker;
