# XphereID — Web user guide

Minimal frontend for the XphereID `.xp` name service on **Xphere Testnet**.

## Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prerequisites

1. MetaMask (or another injected wallet)
2. **Xphere Testnet** added (site can prompt Add/Switch):
   - Chain ID: `1998991`
   - RPC: `https://rpc.ankr.com/xphere_testnet`
   - Symbol: `XPT`
   - Explorer: [https://xpt.tamsa.io](https://xpt.tamsa.io)
3. Testnet XPT from [https://faucet.x-phere.com](https://faucet.x-phere.com)

## User flow

1. **Connect Wallet** — approve in MetaMask. If you are on Ethereum mainnet, click **Switch to Xphere Testnet** (approve Add network if asked).
2. **Search** — type a label (e.g. `alice`). The UI appends `.xp` and shows **Available** or **Taken**.
3. **Register** — if Available, pay `0.01 XPT` + gas. Confirm the transaction. A Tamsa tx link appears when submitted.
4. **Set address** — click **Set address to my wallet** so `alice.xp` resolves to your account.
5. **Resolve** — in the Resolve box, enter the same name and confirm the address.
6. **My Names** — lists names you registered (from `NameRegistered` events), with resolved address, **Copy**, and Tamsa **Explorer** link. Empty state: *Henüz ismin yok*. Use **Refresh** after new txs if needed.

## Notes

- Labels: 3–32 characters, `a-z`, `0-9`, hyphen; no leading/trailing hyphen.
- Contract addresses live in `src/config/contracts.ts` (from `contracts/deployments/testnet.json`).
- No marketplace, subdomains, or mainnet switch in this UI yet.
