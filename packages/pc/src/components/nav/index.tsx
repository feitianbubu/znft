import React, {useMemo} from "react";
import {useMediaQuery, useTheme} from '@mui/material';
import { ENUM_BREAK_POINTS} from "@/pc/constant/enum";
import Xs from './components/xs'
import Sm from './components/sm'
import Md from './components/md'
import Lg from './components/lg'
import XL from './components/xl'
const Nav:React.FC = ()=>{
    const theme = useTheme();
    const isXs= useMediaQuery(theme.breakpoints.up(ENUM_BREAK_POINTS.XS))
    const isSm= useMediaQuery(theme.breakpoints.up(ENUM_BREAK_POINTS.SM))
    const isMd= useMediaQuery(theme.breakpoints.up(ENUM_BREAK_POINTS.MD))
    const isLg= useMediaQuery(theme.breakpoints.up(ENUM_BREAK_POINTS.LG))
    const isXl= useMediaQuery(theme.breakpoints.up(ENUM_BREAK_POINTS.XL))
    const children = useMemo(()=>{
        if(isXl){
            return <XL/>
        }
        if(isLg){
            return <Lg/>
        }
        if(isMd){
            return <Md/>
        }
        if(isSm){
            return <Sm/>
        }
        if(isXs){
            return <Xs/>
        }

    },[isLg, isMd, isSm, isXl, isXs])
    return <>
        {children}
    </>
}
export  default  React.memo(Nav);
