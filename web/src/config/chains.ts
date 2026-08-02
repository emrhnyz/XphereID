import { defineChain } from "viem";

/** Xphere Testnet — see root NETWORKS.md */
export const xphereTestnet = defineChain({
  id: 1998991,
  name: "Xphere Testnet",
  nativeCurrency: {
    name: "Xphere Test Token",
    symbol: "XPT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/xphere_testnet"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tamsa",
      url: "https://xpt.tamsa.io",
    },
  },
  testnet: true,
});

/** Xphere Mainnet — see root NETWORKS.md */
export const xphereMainnet = defineChain({
  id: 20250217,
  name: "Xphere Mainnet",
  nativeCurrency: {
    name: "Xphere",
    symbol: "XP",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://en-hkg.x-phere.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tamsa",
      url: "https://xp.tamsa.io",
    },
  },
  testnet: false,
});
