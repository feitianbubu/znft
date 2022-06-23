import React, {useCallback, useEffect} from "react";
import Image from 'next/image'
import Link from 'next/link'
import profilePic from '@/pc/asset/logo.webp'
import {Button, Stack} from '@mui/material';
import {styled} from "@mui/material/styles";
import {useClintNavigation} from "@/pc/hook/navigation";
const Body = styled("div")({
    width: '100%',
    height:'64px'
})
const Center = styled('div')({
    width:'1200px',
    margin:'0 auto',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
})

const NavLink = styled('a')((props)=>{
    return {
        textDecoration: 'none',
        color: props.theme.palette.text.primary,
        fontWeight: 'bold',
    }
})
const Row = styled(Stack)`
  height: 64px;
  line-height: 64px;

`
const menu:{text:string,route:string}[] = [{
    text:'首页',route:'/',
},{
    text:'市场',route:'/shop',
},{
    text:'案例',route:'/demo',
},{
    text:'游戏',route:'/game',
},{
    text:'下载',route:'/download',
},{
    text:'文档',route:'/docs',
},{
    text:'联系我们',route:'/chat',
}
]


const Nav:React.FC = ()=>{
    const [clientNavigation] = useClintNavigation()
    const p = useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent> )=>{
        e.preventDefault()
        console.log(e.currentTarget.dataset.route)
        const route = e.currentTarget.dataset.route
        if(route){
            clientNavigation.push(route).then()
        }
    },[clientNavigation])
    const render = useCallback((item:{text:string,route:string})=>{
        return <Button key={item.route} data-route={item.route} onClick={p}><Link href={item.route} passHref={true} ><NavLink>{item.text}</NavLink></Link></Button>
    },[p])
    useEffect(()=>{
        console.log("nav mount")
    },[])
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
            <Row direction="row" spacing={2}>
                {menu.map(render)}
            </Row>
        </Center>

    </Body>
}
export  default  Nav;
