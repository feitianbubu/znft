import React from "react";
import Filter from './filter'
import Panel from './panel'
import {styled} from "@mui/material/styles";
import FilterContextProvider from "./context/filter-context";
const FilterDom = styled("div")({
    width: 280,
    padding:24
})
const PanelDom = styled("div")({
    flex:1,
    padding:24
})
const FlexDom = styled("div")({
    display:"flex",
    width:'100%'
})
const Home:React.FC = ()=>{
    return <FilterContextProvider>
        <FlexDom>
            <FilterDom>
                <Filter/>
            </FilterDom>
            <PanelDom>
                <Panel/>
            </PanelDom>
        </FlexDom>
    </FilterContextProvider>
}
export default Home;
