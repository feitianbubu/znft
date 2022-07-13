const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");


task("check-balance", "Prints out the balance of your account").setAction(async function (taskArguments, hre) {
    const account = getAccount();
    console.log(`Account balance for ${account.address}: ${await account.getBalance()}`);
});

task("deploy", "Deploys the NFT.sol contract").setAction(async function (taskArguments, hre) {
    const nftContractFactory = await hre.ethers.getContractFactory("MyFactory", getAccount());
    const nft = await nftContractFactory.deploy("0xf57b2c51ded3a29e6891aba85459d600256cf317","0x3405eCD655c5EC805AaFf17b4b58210d1074a052");
    console.log(`Contract deployed to address: ${nft.address}`, taskArguments);
});