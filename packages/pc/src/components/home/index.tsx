import React from "react";
import Nav from "./nav";
import Body from "./body";
import {styled} from "@mui/material/styles";
const HomeDom = styled("div")({
    width:'100%'
})
const NavDom = styled("div")({
    width: '100%'
})
const FlexDom = styled("div")({
    display:"flex"

})
const Home:React.FC = ()=>{
    return <HomeDom>
        <NavDom>
            <Nav/>
        </NavDom>
       <Body/>
    </HomeDom>
}
export default Home;
