import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "@wagmi/connectors";
import { xphereTestnet } from "./chains";

/**
 * Xphere Testnet is primary. Mainnet is listed only so a wallet on chain 1
 * is detected as "wrong network" instead of an unknown/undefined chain.
 */
export const wagmiConfig = createConfig({
  chains: [xphereTestnet, mainnet],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [xphereTestnet.id]: http(xphereTestnet.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
  },
  ssr: true,
});
