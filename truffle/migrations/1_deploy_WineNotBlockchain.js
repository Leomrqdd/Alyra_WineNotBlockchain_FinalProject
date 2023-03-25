const WineNotBlockchain = artifacts.require("WineNotBlockchain");

module.exports = function (deployer) {
  deployer.deploy(WineNotBlockchain);
};