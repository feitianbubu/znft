import React, {useCallback} from "react";
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/pc/asset/nd-logo.png'
import {Button, Stack} from '@mui/material';
import {styled} from "@mui/material/styles";
import {useClintNavigation} from "@/pc/hook/navigation";
const Body = styled("div")({
    width: '100%',
    height:'64px'
})
const Center = styled('div')({
    width:'100%',
    margin:'0 auto',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
})
const menu:{text:string,route:string}[] = [{
    text:'首页',route:'/introduction',
},{
    text:'案例',route:'/demo',
},{
    text:'游戏',route:'/game',
},{
    text:'下载',route:'/download',
},{
    text:'文档',route:'/docs',
}
]
const NavLink = styled('a')((props)=>{
    return {
        textDecoration: 'none',
        color: props.theme.palette.text.primary,
        fontWeight: 'bold',
    }
})

export  interface  PcNavProps{
    menu:{text:string,route:string}[]
}
const TabletNav:React.FC = ()=>{
    // const [] = useMediaQuery((theme)=>theme.breakpoints.up(""))
    const [clientNavigation] = useClintNavigation()
    const p = useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent> )=>{
        e.preventDefault()
        const route = e.currentTarget.dataset.route
        if(route){
            clientNavigation.push(route).then()
        }
    },[clientNavigation])
    const render = useCallback((item:{text:string,route:string})=>{
        return <Button key={item.route} data-route={item.route} onClick={p}><Link href={item.route} passHref={true} ><NavLink>{item.text}</NavLink></Link></Button>
    },[p])
    return <Body>
        <Center>
            <Image
                src={logo}
                alt="logo"
                width={168}
                height={64}
                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
            />
            <Stack direction="row" spacing={2}>
                {menu.map(render)}
            </Stack>
        </Center>

    </Body>
}
export  default  TabletNav;
