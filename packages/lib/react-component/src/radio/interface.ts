export interface RadioProps{
    list:{label:string, value:string, disabled?:boolean}[]
    defaultValue?:string,
    value?:string
    onChange?:(value:string)=>void
    labelPlacement?:'end' | 'start' | 'top' | 'bottom',
    disabled?:boolean
}
