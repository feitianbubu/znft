import React, {useCallback, useState} from "react";
import {Identicon} from '@lib/util'
import {Avatar, Box, Button} from "@mui/material";

export const Test:React.FC = ()=>{
    const [aa,setAa] = useState("");
    const handle = useCallback(async ()=>{
        const aa = await Identicon.createIcon({
            seed: '0xD8d9385d53E2624e607f05C61b9CD0017e44827C', // seed used to generate icon data, default: random
            size: 8, // width/height of the icon in blocks, default: 8
            scale: 3, // width/height of each block in pixels, default: 4
            // default: random. Set to -1 to disable it. These "spots" create structures
            // that look like eyes, mouths and noses.
        })
        console.log(aa)
        if(aa){
            setAa(aa);
        }
    },[])
    return <div>
        <Box height={100}></Box>
        <Button onClick={handle}>test</Button>
        <Avatar src={aa}/>
    </div>
}
export default Test;
