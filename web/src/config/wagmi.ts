import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "@wagmi/connectors";
import { xphereMainnet, xphereTestnet } from "./chains";

/**
 * Both Xphere networks are configured; UI target is chosen via NEXT_PUBLIC_NETWORK
 * (`activeChain` in active.ts). Ethereum mainnet is for wrong-network detection.
 */
export const wagmiConfig = createConfig({
  chains: [xphereTestnet, xphereMainnet, mainnet],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [xphereTestnet.id]: http(xphereTestnet.rpcUrls.default.http[0]),
    [xphereMainnet.id]: http(xphereMainnet.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
  },
  ssr: true,
});
