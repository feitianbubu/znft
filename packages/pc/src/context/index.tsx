import React, {PropsWithChildren} from "react";
import WalletProvider from "@/pc/context/wallet";
import SnackProvider from "@/pc/context/snack";
import ModeProvider from "@/pc/context/mode";
import ThemeProvider from "@/pc/context/theme";
import ContractProvider from "@/pc/context/contract";

export const Context: React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    return <ModeProvider>
        <ThemeProvider>
            <WalletProvider>
                <SnackProvider>
                    <ContractProvider>
                        {children}
                    </ContractProvider>
                </SnackProvider>
            </WalletProvider>
        </ThemeProvider>
    </ModeProvider>
}
export default Context;
