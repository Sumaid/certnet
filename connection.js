const Web3 = require("web3");
const contract = require("truffle-contract");
const HDWalletProvider = require("truffle-hdwallet-provider");

const log = require("../utils/log");
const certification_artifact = require("../build/contracts/Certification.json");

const CertificationInstance = contract(certification_artifact);

const connectWeb3 = function() {
  const self = this;
  if (process.env.NODE_ENV === "development") {
    self.web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.LOCAL_ENDPOINT)
    );
  } else {
    self.web3 = new Web3(
      new HDWalletProvider(process.env.MNEMONIC, process.env.PROJECT_ENDPOINT)
    );
  }

  CertificationInstance.setProvider(self.web3.currentProvider);
  // hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
  if (typeof CertificationInstance.currentProvider.sendAsync !== "function") {
    CertificationInstance.currentProvider.sendAsync = function() {
      return CertificationInstance.currentProvider.send.apply(
        CertificationInstance.currentProvider,
        arguments
      );
    };
  }

};