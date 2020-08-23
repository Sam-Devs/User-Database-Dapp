const UserDB = artifacts.require("UserDB");

module.exports = function(deployer) {
  deployer.deploy(UserDB);
};
