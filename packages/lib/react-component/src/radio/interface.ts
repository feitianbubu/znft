import {RadioGroupProps} from '@mui/material/RadioGroup/RadioGroup';
import * as React from 'react';

export interface RadioProps extends RadioGroupProps{
    defaultValue?:string,
    value?:string
    labelPlacement?:'end' | 'start' | 'top' | 'bottom',
    label?:React.ReactNode

}
