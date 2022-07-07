import React, {useCallback, useEffect, useState} from "react";
import {
    Avatar,
    Box,
    styled
} from "@mui/material";
import {useWallet} from "@/pc/context/wallet";
import bg from '@/pc/asset/profile.png'
import {Identicon} from "@lib/util";
import {AccountCircleOutlined} from "@mui/icons-material";

const PosAvatar = styled(Avatar)`
  position: absolute;
  bottom: -32px;
  left: 48px;
  border: solid 6px white;
  z-index: 1;
`
const AvatarBg: React.FC = () => {
    const [wallet] = useWallet();
    const [base64, setBase64] = useState("");
    const {address} = wallet;
    const createAvatar = useCallback(async (address: string) => {
        const res = await Identicon.createIcon({seed: address});
        if (res) {
            setBase64(res);
        }

    }, [])
    useEffect(() => {
        if (address) {
            createAvatar(address).then()
        }
    }, [address, createAvatar])
    return <Box height={300}>
        <Box height={240} display={"flex"} justifyContent={"space-between"} position={'relative'}>
            <Box
                component="img"
                alt="The house from the offer."
                src={bg.src}
                width={'100%'}
                sx={{
                    objectFit: 'cover'
                }}
            />
            <PosAvatar src={base64} sx={{width: 180, height: 180}}/>
        </Box>
    </Box>
}
export default AvatarBg
