// import Head from 'next/head'
// import utilStyles from '../styles/utils.module.css'
// import Link from 'next/link'
import React from "react";
// import dynamic from "next/dynamic";
import {useClintNavigation} from "@/pc/hook/navigation";
import {useMount} from "@lib/react-hook";
// const Index = dynamic(
//     () => import("@/pc/components/home"),
//     { ssr: false ,loading: () => (<p>loading...</p>)}
// )  ;
const Index:React.FC = ()=>{
    const [clintNavigation] = useClintNavigation()
    useMount(()=>{
        clintNavigation.push("/introduction").then()
    })
    return <>

    </>
}

export default Index


