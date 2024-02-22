require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETH_URL,
        blockNumber: 19280000  
      }
    },
    chapel: {
      url: process.env.BSC_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: process.env.BSC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
};
