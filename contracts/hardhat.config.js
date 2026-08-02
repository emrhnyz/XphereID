require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const RPC_TESTNET =
  process.env.RPC_TESTNET || "https://rpc.ankr.com/xphere_testnet";
const RPC_MAINNET =
  process.env.RPC_MAINNET || "https://en-hkg.x-phere.com";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    xphereTestnet: {
      url: RPC_TESTNET,
      chainId: 1998991,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    xphereMainnet: {
      url: RPC_MAINNET,
      chainId: 20250217,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
