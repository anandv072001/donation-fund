const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  compilers: {
    solc: {
      version: "0.8.18",
    },
  },
  contracts_build_directory: "./client/src/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      networkCheckTimeout: 999999
    },
    sepolia: {
      networkCheckTimeout: 999999,
      provider: () => new HDWalletProvider('lemon chaos special miracle book match switch record exotic omit drift dad',
      'https://sepolia.infura.io/v3/64b1823cf6124cac926af5fee71503f9'),
      network_id: '*',
      timeoutBlocks: 200,
      gas: 5500000,
      skipDryRun: true
    }
  }
};