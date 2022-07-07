import React, {useCallback, useEffect, useMemo, useState} from "react";
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/pc/asset/nd-logo.png'
import {Button, Drawer, List, ListItem, IconButton, Box} from '@mui/material';
import {Menu} from '@mui/icons-material';
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

const NavLink = styled('a')((props)=>{
    return {
        textDecoration: 'none',
        color: props.theme.palette.text.primary,
        fontWeight: 'bold',
    }
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

const PhoneNav:React.FC = ()=>{
    const [visible,setVisible] = useState(false);
    const [clientNavigation] = useClintNavigation()
    const handleClick = useCallback((e:React.MouseEvent<HTMLButtonElement, MouseEvent> )=>{
        e.preventDefault()
        const route = e.currentTarget.dataset.route
        if(route){
            clientNavigation.push(route).then()
        }
    },[clientNavigation])
    const render = useCallback((item:{text:string,route:string})=>{
        return <ListItem key={item.route}>
            <Button data-route={item.route} onClick={handleClick}>
            <Link href={item.route} passHref={true} ><NavLink>{item.text}</NavLink></Link>
            </Button>
        </ListItem>
    },[handleClick])
    const handleClose = useCallback(()=>{
        setVisible(false)
    },[])
    const _menu = useMemo(()=>{
        return   <List>
            {menu.map(render)}
        </List>
    },[render])
    const handleOpen = useCallback(()=>{
        setVisible(true)
    },[])
    return <Body>
        <Drawer
            anchor={'left'}
            open={visible}
            onClose={handleClose}
        >
            {_menu}
        </Drawer>
        <Center>
            <IconButton onClick={handleOpen} aria-label="delete">
                <Menu />
            </IconButton>

            <Image
                src={logo}
                alt="Picture of the author"
                width={168}
                height={64}
                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
            />
            <Box width={40}/>
        </Center>

    </Body>
}
export  default  PhoneNav;
