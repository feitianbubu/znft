import React from "react";
import Nav from "./nav";
import Body from "./body";
import {styled} from "@mui/material/styles";
import FilterContextProvider from "@/pc/components/home/body/context/filter-context";
import { SnackbarProvider } from 'notistack';
const HomeDom = styled("div")({
    width:'100%'
})
const NavDom = styled("div")({
    width: '100%'
})
const Home:React.FC = ()=>{
    return <HomeDom>
        <SnackbarProvider maxSnack={3}>
        <FilterContextProvider>
            <NavDom>
                <Nav/>
            </NavDom>
            <Body/>
        </FilterContextProvider>
        </SnackbarProvider>
    </HomeDom>
}
export default Home;
