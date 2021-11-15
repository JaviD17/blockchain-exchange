const Token = artifacts.require("Token");

module.exports = function (deployer) {
  deployer.deploy(Token);

  // const token = await Token.deployed();
  // const name = await token.name();
};
