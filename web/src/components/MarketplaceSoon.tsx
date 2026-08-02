"use client";

import styles from "./MarketplaceSoon.module.css";

const previewListings = [
  { name: "alice.xp", price: "—" },
  { name: "nexus.xp", price: "—" },
  { name: "orbit.xp", price: "—" },
  { name: "pulse.xp", price: "—" },
];

export function MarketplaceSoon() {
  return (
    <section id="marketplace" className={styles.section} aria-label="Marketplace">
      <div className={styles.head}>
        <div>
          <div className={styles.badge}>Coming soon</div>
          <h2 className={styles.title}>Marketplace</h2>
          <p className={styles.copy}>
            Buy and sell <strong>.xp</strong> names on a secondary market.
            Listings, offers, and transfers are not live yet — this section is
            closed for now.
          </p>
        </div>
        <button type="button" className={styles.disabled} disabled>
          Marketplace closed
        </button>
      </div>

      <ul className={styles.grid} aria-hidden>
        {previewListings.map((item) => (
          <li key={item.name} className={styles.card}>
            <div className={styles.lock} />
            <span className={styles.name}>{item.name}</span>
            <span className={styles.price}>{item.price}</span>
            <span className={styles.tag}>Unavailable</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
