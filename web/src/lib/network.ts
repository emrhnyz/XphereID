/** MetaMask / EIP-3085 helpers for Xphere Testnet */

export const XPHERE_TESTNET_CHAIN_ID = 1998991;
export const XPHERE_TESTNET_CHAIN_ID_HEX = `0x${XPHERE_TESTNET_CHAIN_ID.toString(16)}`;

const ADD_CHAIN_PARAMS = {
  chainId: XPHERE_TESTNET_CHAIN_ID_HEX,
  chainName: "Xphere Testnet",
  nativeCurrency: {
    name: "Xphere Test Token",
    symbol: "XPT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ankr.com/xphere_testnet"],
  blockExplorerUrls: ["https://xpt.tamsa.io"],
} as const;

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getEthereum(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum;
}

/**
 * Switch to Xphere Testnet; if missing in the wallet, add it first (MetaMask prompt).
 */
export async function ensureXphereTestnet(): Promise<void> {
  const ethereum = getEthereum();
  if (!ethereum?.request) {
    throw new Error("No injected wallet found. Install MetaMask (or similar).");
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: XPHERE_TESTNET_CHAIN_ID_HEX }],
    });
    return;
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? Number((err as { code: number }).code)
        : undefined;

    // 4902 = unrecognized chain — add then switch
    if (code === 4902 || code === -32603) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [ADD_CHAIN_PARAMS],
      });
      return;
    }

    if (code === 4001) {
      throw new Error("Network switch rejected in wallet.");
    }

    throw err instanceof Error
      ? err
      : new Error("Could not switch to Xphere Testnet.");
  }
}
