import React from "react";
import Image from 'next/image'
import profilePic from '@/pc/asset/logo.webp'

const Nav:React.FC = ()=>{
    return <div>
        <Image
            src={profilePic}
            alt="Picture of the author"
            // width={500} automatically provided
            // height={500} automatically provided
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
        />
    </div>
}
export  default  Nav;
