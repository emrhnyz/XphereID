import { xphereMainnet, xphereTestnet } from "./chains";
import { mainnetDeployment, testnetDeployment } from "./contracts";

export type AppNetwork = "testnet" | "mainnet";

/**
 * NEXT_PUBLIC_NETWORK=mainnet → Xphere Mainnet
 * anything else / unset → Xphere Testnet
 */
export const appNetwork: AppNetwork =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : "testnet";

export const activeChain =
  appNetwork === "mainnet" ? xphereMainnet : xphereTestnet;

export const activeDeployment =
  appNetwork === "mainnet" ? mainnetDeployment : testnetDeployment;

export function isDeploymentReady(): boolean {
  const c = activeDeployment.contracts;
  return Boolean(
    c.ENSRegistry &&
      c.PublicResolver &&
      c.XpRegistrar &&
      c.XphereID &&
      c.XpRegistrar.startsWith("0x")
  );
}
