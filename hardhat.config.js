require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    etherlinkShadownet: {
      url: "https://node.shadownet.etherlink.com",
      chainId: 127823,
      accounts,
    },
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      etherlinkShadownet: process.env.ETHERSCAN_API_KEY || "",
      etherlinkMainnet: process.env.ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "etherlinkShadownet",
        chainId: 127823,
        urls: {
          apiURL: "https://shadownet.explorer.etherlink.com/api",
          browserURL: "https://shadownet.explorer.etherlink.com",
        },
      },
      {
        network: "etherlinkMainnet",
        chainId: 42793,
        urls: {
          apiURL: "https://explorer.etherlink.com/api",
          browserURL: "https://explorer.etherlink.com",
        },
      },
    ],
  },
};
