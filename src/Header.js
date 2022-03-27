import './App.css';

import Button from '@mui/material/Button';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";


// Unpkg imports
// const Fortmatic = window.Fortmatic;
// const evmChains = window.evmChains;
let web3Modal;

function init() {

    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    // console.log("Fortmatic is", Fortmatic);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    // if(location.protocol !== 'https:') {
    //   // https://ethereum.stackexchange.com/a/62217/620
    //   const alert = document.querySelector("#alert-error-https");
    //   alert.style.display = "block";
    //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    //   return;
    // }

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        // Example with injected providers
        injected: {
            display: {
                // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
                name: "Injected",
                description: "Connect with the provider in your Browser"
            },
            package: null
        },
        // Example with WalletConnect provider
        // walletconnect: {
        //     display: {
        //         logo: "data:image/gif;base64,INSERT_BASE64_STRING",
        //         name: "Mobile",
        //         description: "Scan qrcode with your mobile wallet"
        //     },
        //     package: WalletConnectProvider,
        //     options: {
        //         infuraId: "INFURA_ID" // required
        //     }
        // }
    };

    web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });

    console.log("Web3Modal instance is", web3Modal);
}


let onConnect = async () => {
  console.log('onConnect');
    init();
    const providerOptions = {
        /* See Provider Options Section */
    };

    const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);
    console.log(`web3: ${web3}`);
};

function App() {
  return (
      <div className="App">
        <header className="App-header">
            <Button variant="contained" onClick={onConnect}>连接钱包</Button>
        </header>
      </div>
  );
}

export default App;
