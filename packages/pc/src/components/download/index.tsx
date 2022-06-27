import React from "react";
import {styled} from "@mui/material";
import Banner from "./banner";
const Body = styled('div')`
    width: 100%;
  min-height: 1800px;
`

const Download :React.FC = ()=>{
    return <Body>
        <Banner/>
    </Body>
}
export  default  Download;
