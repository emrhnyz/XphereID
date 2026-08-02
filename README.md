# XphereID

Human-readable **`.xp` names** on [Xphere](https://x-phere.com/) — a grant-oriented name service demo.

`alice.xp` → `0x…` on-chain. Non-custodial identity infrastructure for the Xphere ecosystem.

## Fee policy

Registration fee is kept **intentionally low** (default **0.01** XPT on testnet / **0.01** XP on mainnet) for the grant demo and public-good positioning. Override with `REGISTER_PRICE_WEI` at deploy time; owner can later call `setPrice`.

## Repo layout

```
/
├── contracts/          # Hardhat + Solidity (ENS-style MVP)
├── web/                # Next.js + wagmi UI
├── NETWORKS.md
├── DEPLOY_TESTNET.md
├── DEPLOY_MAINNET.md
├── DEMO_TESTNET.md
└── README.md
```

## Status

- **Testnet:** deployed — see `contracts/deployments/testnet.json`
- **Mainnet:** script ready — see `DEPLOY_MAINNET.md` / `contracts/deployments/mainnet.json`
- **Web:** `NEXT_PUBLIC_NETWORK=testnet|mainnet`

## Quick start (web)

```bash
cd web
cp .env.example .env.local   # optional; default is testnet
npm install
npm run dev
```

## Deploy

```bash
cd contracts
cp .env.example .env         # fill PRIVATE_KEY, TREASURY_ADDRESS locally
npm install
npx hardhat test
npm run deploy:testnet       # or: npm run deploy:mainnet
```

Never commit `.env` or paste private keys into chat.
