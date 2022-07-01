import * as React from 'react';
import {ToggleButtonGroupProps} from '@mui/material/ToggleButtonGroup/ToggleButtonGroup';

export interface RadioButtonProps extends ToggleButtonGroupProps{
    defaultValue?: string | number ;
    value?: string | number;
    label?:React.ReactNode
}
