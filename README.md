# XphereID

Human-readable **`.xp` names** on [Xphere](https://x-phere.com/).

`alice.xp` → `0x…` on-chain. Non-custodial name service for the Xphere ecosystem.

## Fee

Default registration fee is **0.01** XPT (testnet) / **0.01** XP (mainnet). Override with `REGISTER_PRICE_WEI` at deploy; owner can call `setPrice` later.

## Repo layout

```
/
├── contracts/          # Hardhat + Solidity (ENS-style MVP)
├── web/                # Next.js + wagmi UI
├── NETWORKS.md
├── DEPLOY_TESTNET.md
├── DEPLOY_MAINNET.md
└── README.md
```

## Status

- **Testnet & Mainnet** contracts — see `contracts/deployments/`
- **Web** — `NEXT_PUBLIC_NETWORK=testnet|mainnet`

## Quick start (web)

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

## Deploy

```bash
cd contracts
cp .env.example .env
npm install
npx hardhat test
npm run deploy:testnet
# or: npm run deploy:mainnet
```

Never commit `.env` or share private keys.
