# XphereID — Testnet deploy

Deploy **XphereID** contracts to **Xphere Testnet** (chainId `1998991`).

## Deploy order

1. `ENSRegistry`
2. `PublicResolver(registry)`
3. `XpRegistrar(registry, treasury, price, resolver)`
4. `XphereID(registry)`
5. `ENSRegistry.setSubnodeOwner(root, labelhash("xp"), registrar)` — registrar owns `.xp`

## Prerequisites

1. MetaMask (or other wallet) on Xphere Testnet
2. Testnet XPT from [faucet.x-phere.com](https://faucet.x-phere.com)
3. In `contracts/`, copy env and fill locally (never paste keys into chat):

```bash
cd contracts
cp .env.example .env
```

Required `.env` keys:

| Key | Meaning |
| --- | --- |
| `PRIVATE_KEY` | Deployer key (local only) |
| `RPC_TESTNET` | Default: `https://rpc.ankr.com/xphere_testnet` |
| `TREASURY_ADDRESS` | Fee recipient |
| `REGISTER_PRICE_WEI` | Optional; default `0.01` XPT in wei |

## Example command

```bash
cd contracts
npx hardhat run scripts/deploy-testnet.js --network xphereTestnet
# or: npm run deploy:testnet
```

On success, addresses are written to `contracts/deployments/testnet.json`.

## Addresses (current testnet deploy)

Source: `contracts/deployments/testnet.json`  
Deployed at: `2026-08-02T16:53:37.439Z`

| Contract | Address |
| --- | --- |
| ENSRegistry | [`0x2C39B3873d45257C27dFa777d5BaC39589FCE546`](https://xpt.tamsa.io/address/0x2C39B3873d45257C27dFa777d5BaC39589FCE546) |
| PublicResolver | [`0x5b57952AF68e8608D667777ce51726d4d1014A6F`](https://xpt.tamsa.io/address/0x5b57952AF68e8608D667777ce51726d4d1014A6F) |
| XpRegistrar | [`0x8B9B94ca30dE5147cb57D4B7afE5B0b9A9E2dBbD`](https://xpt.tamsa.io/address/0x8B9B94ca30dE5147cb57D4B7afE5B0b9A9E2dBbD) |
| XphereID | [`0x070C0BFd807D11d8ccfD25F2052273098F5c102F`](https://xpt.tamsa.io/address/0x070C0BFd807D11d8ccfD25F2052273098F5c102F) |

| Field | Value |
| --- | --- |
| Deployer / Treasury | `0x3B0E04cE7b3051024eeC8d5343F24c54077Ec3e2` |
| Register price | `0.01` XPT |
| `baseNode` (`.xp`) | `0xca6be387bd1d023a035f36cf21918265350763acfd55558bcbdf3a9035066b8d` |
| `setXpOwner` tx | [`0x67ad205aa7de0a9bc83bceda209e354cd0cb64c1eea80ad254641abfc9ec80d5`](https://xpt.tamsa.io/tx/0x67ad205aa7de0a9bc83bceda209e354cd0cb64c1eea80ad254641abfc9ec80d5) |

## How to find txs on Tamsa (testnet)

Explorer: [https://xpt.tamsa.io](https://xpt.tamsa.io)

1. Open the explorer
2. Paste a **contract address** or **tx hash** into search
3. Confirm the deployer account and each deploy tx
4. Open `XpRegistrar` and try one `register` (console, cast, or later UI)

Useful checks:

- Each contract address page shows creation txs
- `setXpOwner` tx succeeded
- After a test register: new tx on `XpRegistrar`

## Contract verification

**Manuel.** Tamsa does not expose a documented Hardhat/Etherscan-style verify API for this flow. For the product demo: keep `testnet.json` + this doc + repo source. If Tamsa/Sourcify verify UI appears later, verify there manually.

## Smoke register (optional)

```bash
cd contracts
npx hardhat console --network xphereTestnet
```

```js
const r = await ethers.getContractAt(
  "XpRegistrar",
  "0x8B9B94ca30dE5147cb57D4B7afE5B0b9A9E2dBbD"
);
await (await r.register("demo", { value: ethers.parseEther("0.01") })).wait();
```

## Network reference

See root `NETWORKS.md`.
