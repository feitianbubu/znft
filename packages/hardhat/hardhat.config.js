require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("./scripts/deploy.js");
require("./scripts/mint.js");
require("@nomiclabs/hardhat-etherscan");
const { ALCHEMY_KEY,ALCHEMY_MUMBAI_KEY, ACCOUNT_PRIVATE_KEY, ETHERSCAN_API_KEY,NETWORK } = process.env;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const maticMumApiUrl =`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_KEY}`;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: NETWORK,
  networks: {
    hardhat: {
      forking: {
        url: maticMumApiUrl,
        blockNumber: 27123053,
      }
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
    },
    maticmum: {
      url: maticMumApiUrl,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.5.12",
      },
      {
        version: "0.5.11",
      },
      {
        version: "0.5.0",
      },
    ],
    // version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
