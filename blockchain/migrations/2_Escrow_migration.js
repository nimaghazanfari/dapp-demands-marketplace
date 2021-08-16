const Escrow = artifacts.require("Escrow");

module.exports = function (deployer) {
  const commission = 10;
  deployer.deploy(Escrow, commission);
};
