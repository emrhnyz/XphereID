# XphereID — Mainnet deploy

Deploy the **same contracts** as testnet to **Xphere Mainnet** (chainId `20250217`).

Registration fee stays **low by default (`0.01` XP)** for the product demo — not a high-fee cash grab.

## Deploy order

1. `ENSRegistry`
2. `PublicResolver(registry)`
3. `XpRegistrar(registry, treasury, price, resolver)`
4. `XphereID(registry)`
5. `ENSRegistry.setSubnodeOwner(root, labelhash("xp"), registrar)`

## Prerequisites

1. Wallet funded with **real XP** on Xphere Mainnet (fee + gas for 5 deploys + `setSubnodeOwner`)
2. MetaMask network (see `NETWORKS.md`):
   - Chain ID: `20250217`
   - RPC: `https://en-hkg.x-phere.com` (alt: `https://en-bkk.x-phere.com`)
   - Symbol: `XP`
   - Explorer: https://xp.tamsa.io
3. In `contracts/`, fill `.env` locally (never paste private keys into chat):

```bash
cd contracts
cp .env.example .env
```

| Key | Meaning |
| --- | --- |
| `PRIVATE_KEY` | Deployer (local only) |
| `RPC_MAINNET` | Default `https://en-hkg.x-phere.com` |
| `TREASURY_ADDRESS` | Fee recipient |
| `REGISTER_PRICE_WEI` | Optional; default `0.01` XP in wei (`10000000000000000`) |

## Example command

```bash
cd contracts
npx hardhat run scripts/deploy-mainnet.js --network xphereMainnet
# or: npm run deploy:mainnet
```

On success, writes:

`contracts/deployments/mainnet.json`

## After deploy — wire the frontend

1. Copy `contracts` / `deployBlock` / fee fields from `mainnet.json` into `web/src/config/contracts.ts` → `mainnetDeployment`
2. In `web/`:

```bash
# web/.env.local
NEXT_PUBLIC_NETWORK=mainnet
```

3. Restart the app:

```bash
cd web
npm run dev
```

Use `NEXT_PUBLIC_NETWORK=testnet` (or omit) to stay on testnet.

## Addresses

Until you run the script, placeholders live in `mainnet.json`. After deploy, fill this table:

| Contract | Address |
| --- | --- |
| ENSRegistry | _(see mainnet.json)_ |
| PublicResolver | _(see mainnet.json)_ |
| XpRegistrar | _(see mainnet.json)_ |
| XphereID | _(see mainnet.json)_ |

Also save: deployer, treasury, `setXpOwner` tx, `deployBlock`, `baseNode`.

## Explorer

https://xp.tamsa.io — paste contract address or tx hash.

## Verification

**Manuel** (same as testnet). No documented Hardhat verify API for Tamsa — keep source in repo + explorer links.

## Fee policy

Keep `REGISTER_PRICE_WEI` low (default **0.01 XP**). Note this in docs as You can raise later via `XpRegistrar.setPrice` (owner).

## Smoke register (optional)

```bash
cd contracts
npx hardhat console --network xphereMainnet
```

```js
const r = await ethers.getContractAt("XpRegistrar", "0xREGISTRAR_FROM_JSON");
await (await r.register("hello", { value: ethers.parseEther("0.01") })).wait();
```

## Related

- Testnet: `DEPLOY_TESTNET.md`
- Networks: `NETWORKS.md`
