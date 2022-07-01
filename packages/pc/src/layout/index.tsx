import React, {PropsWithChildren, useEffect} from "react";
import Nav from "@/pc/components/nav";
import Footer from "@/pc/components/footer";
import {Box, Toolbar, useTheme} from "@mui/material";
export const Layout:React.FC<PropsWithChildren<unknown>> = (props)=>{
    const theme = useTheme();
    useEffect(()=>{
        console.log('theme',theme)
    },[theme])
    return <Box bgcolor={theme=>theme.palette.background.default}>
        <Nav/>
        <Toolbar/>
        {props.children}
        <Footer/>
    </Box>
}
export default Layout
