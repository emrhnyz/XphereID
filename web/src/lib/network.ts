import { activeChain } from "@/config/active";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getEthereum(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum;
}

function chainIdHex(id: number): `0x${string}` {
  return `0x${id.toString(16)}`;
}

/**
 * Switch to the active Xphere network; if missing in the wallet, add it first.
 */
export async function ensureActiveXphereChain(): Promise<void> {
  const ethereum = getEthereum();
  if (!ethereum?.request) {
    throw new Error("No injected wallet found. Install MetaMask (or similar).");
  }

  const hex = chainIdHex(activeChain.id);
  const addParams = {
    chainId: hex,
    chainName: activeChain.name,
    nativeCurrency: {
      name: activeChain.nativeCurrency.name,
      symbol: activeChain.nativeCurrency.symbol,
      decimals: activeChain.nativeCurrency.decimals,
    },
    rpcUrls: [...activeChain.rpcUrls.default.http],
    blockExplorerUrls: activeChain.blockExplorers?.default.url
      ? [activeChain.blockExplorers.default.url]
      : [],
  };

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hex }],
    });
    return;
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? Number((err as { code: number }).code)
        : undefined;

    if (code === 4902 || code === -32603) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [addParams],
      });
      return;
    }

    if (code === 4001) {
      throw new Error("Network switch rejected in wallet.");
    }

    throw err instanceof Error
      ? err
      : new Error(`Could not switch to ${activeChain.name}.`);
  }
}

/** @deprecated use ensureActiveXphereChain */
export const ensureXphereTestnet = ensureActiveXphereChain;
