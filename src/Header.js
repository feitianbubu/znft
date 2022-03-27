import './App.css';

import Button from '@mui/material/Button';
import Web3 from "web3";
// import Web3Modal from "web3modal";

let onConnect = async () => {
  console.log('onConnect');
    // const providerOptions = {
    //     /* See Provider Options Section */
    // };
    //
    // const web3Modal = new Web3Modal({
    //     network: "mainnet", // optional
    //     cacheProvider: true, // optional
    //     providerOptions // required
    // });
    //
    // const provider = await web3Modal.connect();
    //
    const web3 = new Web3(window.web3.currentProvider);
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
