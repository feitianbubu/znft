export const switchMetamaskChain =async (chainId: string,config:{chainId:string,chainName:string,rpcUrls:string[]}) =>{
    const ethereum = (window as any).ethereum
    if(ethereum){
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId}],
            });
        } catch (switchError: any) {
            console.log('switch error',switchError.message)
            // This error code indicates that the chain has not been added to MetaMask.
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        config,
                    ],
                });
            } catch (addError:any) {
                console.log('add error')
                throw Error(`添加失败${addError.toString()}`)
            }
        }
    }else{
        throw Error(`not install metamask`)
    }

}
