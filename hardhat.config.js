require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  networks: {
    fuji: {
      url: process.env.INFURA_FUJI_URL,
      accounts: [
        process.env.PRIVATE_KEY_OWNER,
        process.env.PRIVATE_KEY_ADMIN,
        process.env.PRIVATE_KEY_ACC1,
        process.env.PRIVATE_KEY_ACC2,
      ],
    },
    mumbai: {
      url: process.env.INFURA_MUMBAI_URL,
      accounts: [
        process.env.PRIVATE_KEY_OWNER,
        process.env.PRIVATE_KEY_ADMIN,
        process.env.PRIVATE_KEY_ACC1,
        process.env.PRIVATE_KEY_ACC2,
      ],
    },
  },
};
