const { getNetwork } = require("@ethersproject/networks");
const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");


// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (!defaultValue) {
        throw `${key} is not defined and no default value was provided`;
    }
    return defaultValue;
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
    const NETWORK = getEnvVariable("NETWORK", "rinkeby");
    if(NETWORK === 'maticmum'){
        const ALCHEMY_MUMBAI_KEY = getEnvVariable("ALCHEMY_MUMBAI_KEY");
        return new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_KEY}`);
    }
    return ethers.getDefaultProvider(NETWORK, {
        alchemy: getEnvVariable("ALCHEMY_KEY"),
    });
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
    return new ethers.Wallet(getEnvVariable("ACCOUNT_PRIVATE_KEY"), getProvider());
}

// Helper method for fetching a contract instance at a given address
function getContract(contractName, hre) {
    const account = getAccount();
    return getContractAt(hre, contractName, getEnvVariable("NFT_CONTRACT_ADDRESS"), account);
}

module.exports = {
    getEnvVariable,
    getProvider,
    getAccount,
    getContract,
}