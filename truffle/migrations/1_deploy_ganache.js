const WineNotBlockchain = artifacts.require("WineNotBlockchain");
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');




module.exports = async function (deployer) {
  await deployer.deploy(WineNotBlockchain);
  let instance = await WineNotBlockchain.deployed();
  console.log('Deployed', instance.address)
  console.log('Deployed to network:', instance.constructor.network_id);
  let accounts = await web3.eth.getAccounts()
  const Producer = accounts[1];
  const Admin = accounts[0];
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