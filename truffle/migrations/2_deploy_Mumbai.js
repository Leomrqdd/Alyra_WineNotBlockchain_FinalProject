const WineNotBlockchain = artifacts.require("WineNotBlockchain");
const Web3 = require('web3');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
provider = new HDWalletProvider(`${process.env.MNEMONIC}`, `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`)
web3 = new Web3(provider);




module.exports = async function (deployer) {
  await deployer.deploy(WineNotBlockchain);
  let instance = await WineNotBlockchain.deployed();
  console.log('Deployed', instance.address)
  console.log('Deployed to network:', instance.constructor.network_id);
  const Producer = "0x79324454D5B2CD3eE0755EDCBd4c85c3e51F7C80";
  const Admin = "0x0eBC8C6542748A085E6915276F841d9AC118E818";
  console.log('Admin Account : ', Admin)
  console.log('Producer Account : ', Producer)
  await instance.whitelistProducer(Producer,{ from: Admin })
  .then((result) => {
      console.log("It worked :) !", result);
  })
  .catch((error) => {
      console.error("It failed :( :", error);
  });

  console.log('Is the Producer Account whitelisted ? ', await instance.isWhitelistedProducer(Producer,{ from: Admin }));

};