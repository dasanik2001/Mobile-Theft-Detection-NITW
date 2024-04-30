const PhoneRegistry = artifacts.require("PhoneRegistry");

module.exports = function (deployer) {
  deployer.deploy(PhoneRegistry);
};
