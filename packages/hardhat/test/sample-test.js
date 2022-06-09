const { expect } = require("chai");
const { ethers, network} = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    await network.provider.send("hardhat_setBalance", [
      "0x279A4C36098c4e76182706511AB0346518ad6049",
      "0x9999999999999999999999999",
    ]);

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
