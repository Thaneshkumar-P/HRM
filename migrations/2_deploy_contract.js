// eslint-disable-next-line no-undef
const HRMContract = artifacts.require('MyContract'); // Ensure the contract name matches

module.exports = function (deployer) {
  deployer.deploy(HRMContract, /* constructor arguments if any */);
};
