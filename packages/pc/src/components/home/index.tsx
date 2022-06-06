import React from "react";
import Nav from "./nav";
import Body from "./body";
import {styled} from "@mui/material/styles";
import FilterContextProvider from "@/pc/components/home/body/context/filter-context";
const HomeDom = styled("div")({
    width:'100%'
})
const NavDom = styled("div")({
    width: '100%'
})
const Home:React.FC = ()=>{
    return <HomeDom>
        <FilterContextProvider>
            <NavDom>
                <Nav/>
            </NavDom>
            <Body/>
        </FilterContextProvider>
    </HomeDom>
}
export default Home;
