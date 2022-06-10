import React from "react";
import Nav from "./nav";
import Body from "./body";
import {styled} from "@mui/material/styles";
import FilterContextProvider from "@/pc/components/home/body/context/filter-context";
import {SnackbarKey, SnackbarProvider} from 'notistack';
import {Button} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const HomeDom = styled("div")({
    width: '100%'
})
const NavDom = styled("div")({
    width: '100%'
})
const Home: React.FC = () => {
    const notistackRef = React.createRef<SnackbarProvider>();
    const onClickDismiss = (key: SnackbarKey) => () => {
        notistackRef?.current?.closeSnackbar(key);
    }
    return <HomeDom>
        <SnackbarProvider maxSnack={3} ref={notistackRef} action={(key: SnackbarKey) => (
            <Button onClick={onClickDismiss(key)} endIcon={<CloseIcon/>}/>
        )}>
            <FilterContextProvider>
                <NavDom>
                    <Nav/>
                </NavDom>
                <Body/>
            </FilterContextProvider>
        </SnackbarProvider>
    </HomeDom>
}
export default Home;
