// eslint-disable-next-line no-undef
const HRM = artifacts.require('Migrations')

module.exports = function (deployer) {
    deployer.deploy(HRM);
};