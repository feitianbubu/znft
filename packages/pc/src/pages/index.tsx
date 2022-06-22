// import Head from 'next/head'
// import utilStyles from '../styles/utils.module.css'
// import Link from 'next/link'
import React from "react";
// import dynamic from "next/dynamic";
import Shop from "@/pc/components/shop"
import Nav from "@/pc/components/nav";
// const Index = dynamic(
//     () => import("@/pc/components/home"),
//     { ssr: false ,loading: () => (<p>loading...</p>)}
// )  ;
const Index:React.FC = ()=>{
    return <>
         {/*<Nav/>*/}
         <Shop/>
    </>
}

export default Index


