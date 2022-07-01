import {DefaultComponentProps} from '@mui/material/OverridableComponent';
import {BoxTypeMap} from '@mui/material/Box/Box';
import {TooltipProps} from '@mui/material/Tooltip/Tooltip';

export interface BaseProps extends DefaultComponentProps<BoxTypeMap>{
  text?:string,
  successText?:string;
  errorText?:string
}
export type CopyProps = BaseProps&Pick<TooltipProps, 'arrow'|'placement'>;
