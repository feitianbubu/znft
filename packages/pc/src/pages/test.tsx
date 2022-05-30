import React, {useCallback} from "react";
import {ButtonGroup,Button} from "@mui/material"
export const Test:React.FC = ()=>{
    const handle = useCallback((e:any)=>{
        console.log(e.target)
        console.log(e.target.value)
    },[])
    return <div><ButtonGroup variant="contained" aria-label="outlined primary button group" onClick={handle}>
        <Button key={1} data-index={1} value={1}>One</Button>
        <Button key={2}  data-index={2} value={2}>Two</Button>
        <Button key={3}  data-index={3} value={3}>Three</Button>
    </ButtonGroup></div>
}
export default Test;
