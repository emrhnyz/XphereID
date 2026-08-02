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
