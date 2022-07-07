import React, {PropsWithChildren} from "react";
import HeroAbiProvider from "@/pc/context/abi/hero";
import AuctionAbiProvider from "@/pc/context/abi/auction";
import MintBoxAbiProvider from "@/pc/context/abi/mint";
import PreSaleAbiProvider from "@/pc/context/abi/preSale";

export const AbiProvider: React.FC<PropsWithChildren<unknown>> = (props) => {
    const {children} = props;
    return <HeroAbiProvider>
        <AuctionAbiProvider>
            <MintBoxAbiProvider>
                <PreSaleAbiProvider>
                    {children}
                </PreSaleAbiProvider>
            </MintBoxAbiProvider>
        </AuctionAbiProvider>
    </HeroAbiProvider>
}
export default AbiProvider;
