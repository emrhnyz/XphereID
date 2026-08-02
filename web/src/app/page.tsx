import { ConnectWallet } from "@/components/ConnectWallet";
import { MyNames } from "@/components/MyNames";
import { NameFlow } from "@/components/NameFlow";
import { activeChain, activeDeployment, appNetwork } from "@/config/active";
import styles from "./page.module.css";

export default function Home() {
  const { chainId, registerPriceNative, nativeSymbol } = activeDeployment;

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <span className={styles.brandMark}>XphereID</span>
        <ConnectWallet />
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>Xphere Name Service</p>
        <h1 className={styles.title}>XphereID</h1>
        <p className={styles.lead}>
          Search a <strong>.xp</strong> name, register it, then set and resolve
          an address on {activeChain.name}.
        </p>
        <p className={styles.hint}>
          Mode <code>{appNetwork}</code> · chainId <code>{chainId}</code> · fee{" "}
          <code>
            {registerPriceNative} {nativeSymbol}
          </code>{" "}
          + gas
        </p>

        <NameFlow />
        <MyNames />
      </main>

      <footer className={styles.footer}>
        Grant demo · low fee · register · setAddr · resolve · my names
      </footer>
    </div>
  );
}
