const MediaAuthentication = artifacts.require("MediaAuthentication");

module.exports = function (deployer) {
  // Deploy the MediaAuthentication contract
  deployer.deploy(MediaAuthentication);
};
