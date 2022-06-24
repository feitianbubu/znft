import React from "react";
import {styled} from "@mui/material";
import Banner from "./banner";
import Special from "./special";
import Devops from "./devops";
import More from "./more";
import Statistic from "./statistic";
import News from "./news";
import Game from "./game";
const Body = styled('div')`
    width: 100%;
  min-height: 1800px;
`

const Introduction:React.FC = ()=>{
    return <Body>
        <Banner/>
        <Special/>
        <Devops/>
        <More/>
        <Statistic/>
        <News/>
        <Game/>
    </Body>
}
export  default  Introduction;
