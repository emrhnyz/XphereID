/**
 * Copied from contracts/deployments/testnet.json
 * Update this file after redeploying testnet contracts.
 */
export const testnetDeployment = {
  network: "Xphere Testnet",
  chainId: 1998991,
  rpc: "https://rpc.ankr.com/xphere_testnet",
  explorer: "https://xpt.tamsa.io",
  treasury: "0x3B0E04cE7b3051024eeC8d5343F24c54077Ec3e2",
  registerPriceWei: "10000000000000000",
  registerPriceXpt: "0.01",
  tld: ".xp",
  baseNode:
    "0xca6be387bd1d023a035f36cf21918265350763acfd55558bcbdf3a9035066b8d",
  /** Approx. block when contracts went live (setXpOwner tx) — for event scans */
  deployBlock: 53490387,
  contracts: {
    ENSRegistry: "0x2C39B3873d45257C27dFa777d5BaC39589FCE546",
    PublicResolver: "0x5b57952AF68e8608D667777ce51726d4d1014A6F",
    XpRegistrar: "0x8B9B94ca30dE5147cb57D4B7afE5B0b9A9E2dBbD",
    XphereID: "0x070C0BFd807D11d8ccfD25F2052273098F5c102F",
  },
} as const;

export type ContractName = keyof typeof testnetDeployment.contracts;
