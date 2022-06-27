import React, {useCallback} from "react";
import Image from 'next/image'
import Link from 'next/link'
import profilePic from '@/pc/asset/logo.webp'
import {Button, Stack} from '@mui/material';
import {styled} from "@mui/material/styles";
import {useClintNavigation} from "@/pc/hook/navigation";
const Body = styled("div")((props)=>{
    return {
        width: '100%',
        height:'64px',
        position:'sticky',
        top:0,
        zIndex:100,
        backgroundColor:props.theme.palette.background.default,
        opacity:0.8
    }
})
const Center = styled('div')({
    width:'1200px',
    margin:'0 auto',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
})

const NavLink = styled('a')<{disabled?:boolean}>(({disabled,theme})=>{
    console.log(theme)
    return {
        textDecoration: 'none',
        color: disabled?theme.palette.text.disabled:theme.palette.text.primary,
        fontWeight: 'bold',
    }
})
const menu:{text:string,route:string, disabled?:boolean}[] = [{
    text:'首页',route:'/',
},{
    text:'市场',route:'/market',
},{
    text:'案例',route:'/demo', disabled:true
},{
    text:'游戏',route:'/game'
},{
    text:'下载',route:'/download'
},{
    text:'文档',route:'/docs',
},{
    text:'联系我们',route:'/chat', disabled:true
}
]

const DesktopNav:React.FC= ()=>{
    const [clientNavigation] = useClintNavigation()
    const handleClick = useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent> )=>{
        e.preventDefault()
        const route = e.currentTarget.dataset.route
        if(route){
            clientNavigation.push(route).then()
        }
    },[clientNavigation])
    const render = useCallback((item:{text:string,route:string,disabled?:boolean})=>{
        return <Button key={item.route} data-route={item.route} onClick={handleClick} disabled={item.disabled}>
            <Link passHref={true} href={item.route}>
                <NavLink disabled={item.disabled}>{item.text}</NavLink>
            </Link>
        </Button>
    },[handleClick])
    return <Body>
        <Center>
            <Image
                src={profilePic}
                alt="Picture of the author"
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
export  default  DesktopNav;
