export interface ColorPickerProps{
    /**
     * value
     */
    value?:string;
    defaultValue?:string;
    onChange?:(value:string)=>void;
    children?:React.ReactElement
  }
