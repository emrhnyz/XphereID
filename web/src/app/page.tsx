import Image from "next/image";
import { ConnectWallet } from "@/components/ConnectWallet";
import { HowItWorks } from "@/components/HowItWorks";
import { MarketplaceSoon } from "@/components/MarketplaceSoon";
import { MyNames } from "@/components/MyNames";
import { NameFlow } from "@/components/NameFlow";
import { activeChain, activeDeployment, appNetwork } from "@/config/active";
import styles from "./page.module.css";

export default function Home() {
  const { chainId, registerPriceNative, nativeSymbol } = activeDeployment;

  return (
    <div className={styles.page}>
      <div className={styles.aurora} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <header className={styles.nav}>
        <a className={styles.brand} href="#top">
          <Image
            src="/xphereid-logo.png"
            alt=""
            width={36}
            height={36}
            className={styles.brandLogo}
            priority
          />
          <span>XphereID</span>
        </a>
        <nav className={styles.navLinks} aria-label="Primary">
          <a href="#register">Register</a>
          <a href="#how">How it works</a>
          <a href="#my-names">My Names</a>
          <a href="#marketplace" className={styles.soon}>
            Marketplace <span className={styles.soonChip}>Soon</span>
          </a>
        </nav>
        <div className={styles.navRight}>
          <ConnectWallet />
        </div>
      </header>

      <section id="top" className={styles.hero}>
        <p className={styles.eyebrow}>.xp name service</p>
        <h1 className={styles.heroBrand}>XphereID</h1>
        <p className={styles.lead}>
          Create, register, and resolve human-readable names for your wallet on
          Xphere.
        </p>
        <div className={styles.ctaRow}>
          <a className={styles.ctaPrimary} href="#register">
            Search a name
          </a>
          <a className={styles.ctaGhost} href="#how">
            How it works
          </a>
        </div>
        <p className={styles.metaRow}>
          <span>{activeChain.name}</span>
          <span className={styles.dot} aria-hidden />
          <span>
            chainId <code>{chainId}</code>
          </span>
          <span className={styles.dot} aria-hidden />
          <span>
            <code>
              {registerPriceNative} {nativeSymbol}
            </code>{" "}
            + gas
          </span>
          <span className={styles.dot} aria-hidden />
          <span>
            mode <code>{appNetwork}</code>
          </span>
        </p>
      </section>

      <main className={styles.main}>
        <NameFlow />
        <HowItWorks />
        <div id="my-names">
          <MyNames />
        </div>
        <MarketplaceSoon />
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerBrand}>XphereID</span>
        <span>Readable .xp names on Xphere</span>
      </footer>
    </div>
  );
}
