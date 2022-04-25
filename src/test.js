let Web3 = require('web3');
let web3 = new Web3('http://43.130.65.178:61229');

let abiJson  =require('./config/abi.json');
let  heroCoreJson =require('./config/HeroCore.json');

const jsonInterface = heroCoreJson.abi;
const contractAddress = abiJson.contractAddress;

heroContract = new web3.eth.Contract(jsonInterface, contractAddress);
// get tokenof

let tokenIds = async function(){

    let res = await heroContract.methods.tokenOf('0x69C23cc39798a21D3b57F6f473abc78D467e6C7D').call().catch(console.error);
    let myres = await heroContract.methods.tokenOf('0x279A4C36098c4e76182706511AB0346518ad6049').call().catch(console.error);
    console.log(res, myres);
}

tokenIds();