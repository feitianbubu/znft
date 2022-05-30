import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import React from "react";
import dynamic from "next/dynamic";
import Home from "@/pc/components/home"
// const Index = dynamic(
//     () => import("@/pc/components/home"),
//     { ssr: false ,loading: () => (<p>loading...</p>)}
// )  ;

export default Home


