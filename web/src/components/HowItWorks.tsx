import styles from "./HowItWorks.module.css";

const steps = [
  {
    n: "01",
    title: "Search",
    body: "Pick a label — we append .xp. Check if it’s available on-chain in seconds.",
  },
  {
    n: "02",
    title: "Register",
    body: "Pay the fee + gas. Ownership is written to the Xphere registry — yours, non-custodial.",
  },
  {
    n: "03",
    title: "Set address",
    body: "Point yourname.xp at your wallet so others can resolve it to your 0x address.",
  },
  {
    n: "04",
    title: "Resolve",
    body: "Look up any .xp name and get the linked address — ready for sends and apps.",
  },
];

const pillars = [
  {
    title: "Human-readable",
    body: "Replace long hex with names like alice.xp — easier to share and remember.",
  },
  {
    title: "On Xphere",
    body: "Built for the Xphere L1. Same wallet flow you already use with MetaMask.",
  },
  {
    title: "Yours on-chain",
    body: "Names live in smart contracts. No custodial account — control stays with your key.",
  },
];

export function HowItWorks() {
  return (
    <>
      <section id="how" className={styles.how} aria-labelledby="how-title">
        <div className={styles.intro}>
          <p className={styles.kicker}>How it works</p>
          <h2 id="how-title" className={styles.title}>
            From name to address in four steps
          </h2>
          <p className={styles.sub}>
            Search, register, set your address, then resolve — the full loop for
            .xp identity on Xphere.
          </p>
        </div>

        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.n} className={styles.step}>
              <span className={styles.stepNum}>{step.n}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>

        <div className={styles.flow} aria-hidden>
          <div className={styles.flowTrack}>
            <span className={styles.chip}>you.xp</span>
            <span className={styles.arrow} />
            <span className={styles.chipMuted}>registry</span>
            <span className={styles.arrow} />
            <span className={styles.chipAccent}>0x…wallet</span>
          </div>
        </div>
      </section>

      <section className={styles.why} aria-labelledby="why-title">
        <div className={styles.intro}>
          <p className={styles.kicker}>Why XphereID</p>
          <h2 id="why-title" className={styles.title}>
            Identity that fits the chain
          </h2>
        </div>
        <ul className={styles.pillars}>
          {pillars.map((p) => (
            <li key={p.title} className={styles.pillar}>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarBody}>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
