# XphereID — Testnet end-to-end demo

Use this checklist while you walk through the live app on **Xphere Testnet** (chainId `1998991`).  
No code changes required for this step — run the UI, save TX links, optionally record a short video later (or after mainnet).

## Quick links

| Item | Value |
| --- | --- |
| App | `cd web && npm run dev` → http://localhost:3000 |
| Explorer | https://xpt.tamsa.io |
| Faucet | https://faucet.x-phere.com |
| RPC | `https://rpc.ankr.com/xphere_testnet` |
| Fee | `0.01` XPT + gas |
| Registrar | [`0x8B9B94ca30dE5147cb57D4B7afE5B0b9A9E2dBbD`](https://xpt.tamsa.io/address/0x8B9B94ca30dE5147cb57D4B7afE5B0b9A9E2dBbD) |
| XphereID | [`0x070C0BFd807D11d8ccfD25F2052273098F5c102F`](https://xpt.tamsa.io/address/0x070C0BFd807D11d8ccfD25F2052273098F5c102F) |
| Full deploy notes | `DEPLOY_TESTNET.md` · `contracts/deployments/testnet.json` |

---

## 1) Step-by-step user scenario

Do this once with a **fresh unused label** (3–32 chars, `a-z` / `0–9` / hyphen). Example: `demoalice`.

1. Open the app (`npm run dev` in `/web`).
2. Click **Connect Wallet** → approve in MetaMask.
3. If MetaMask is on Ethereum (or any other chain), click **Switch to Xphere Testnet** and approve **Add network** if prompted.
4. Confirm header shows **Xphere Testnet** and your shortened address.
5. In **Search & register**, type the label (do not type `.xp` — UI adds it). Status should show **Available**.
6. Click **Register · 0.01 XPT + gas** → confirm in wallet → wait for success.
7. Click **Set address to my wallet** → confirm → wait for success.
8. In **Resolve**, enter the same label → click **Resolve** → your wallet address should appear.
9. Open **My Names** → **Refresh** if needed → the name should list with address, **Copy**, and **Explorer**.
10. On Tamsa, open each TX hash (from the UI links or MetaMask activity) and confirm success.

Repeat with **2–3 different names** if you want richer grant evidence.

---

## 2) TX types to save

Paste Tamsa links below after your run (`https://xpt.tamsa.io/tx/0x…`).

| # | Type | What it proves | Your link |
| --- | --- | --- | --- |
| A | **register** | `XpRegistrar.register` — name assigned, fee paid | _paste here_ |
| B | **setAddr** | `PublicResolver.setAddr` — name → your wallet | _paste here_ |
| C | (optional) 2nd **register** | Another label works too | _paste here_ |
| D | (optional) 2nd **setAddr** | Consistency | _paste here_ |

Also note:

- Name(s) used: e.g. `_______.xp`
- Wallet address: `0x…`
- Date / time of demo:

---

## 3) Five scenes for a screen video (optional now)

Keep each scene short (5–15s). You can film this on testnet now or redo after mainnet polish.

| Scene | Show on screen | Say / imply |
| --- | --- | --- |
| 1 | Landing + **Connect Wallet** → connected on Xphere Testnet | Product is XphereID / `.xp` names |
| 2 | Search → **Available** → **Register** → wallet confirm | Registration with low fee |
| 3 | **Set address to my wallet** → confirm | Non-custodial bind to address |
| 4 | **Resolve** returns the same address | Name → address works |
| 5 | **My Names** + Tamsa TX/address page | On-chain proof visible on explorer |

Tip: zoom browser to ~110–125% so labels and TX links are readable in the recording.

---

## 4) Common errors and fixes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| “Wrong network” / chain id `1` vs `1998991` | Wallet on Ethereum mainnet | Click **Switch to Xphere Testnet**; approve Add network if asked. Manual: Chain ID `1998991`, RPC `https://rpc.ankr.com/xphere_testnet`, symbol `XPT`. |
| Register fails / insufficient funds | No XPT or only dust | Use [faucet.x-phere.com](https://faucet.x-phere.com); need **0.01 XPT fee + gas**. |
| Status stuck / can’t check availability | Not on testnet | Switch network first; availability reads only on chain `1998991`. |
| **Taken** on a name you wanted | Already registered | Pick another label. |
| Invalid name | Label rules | 3–32 chars, lowercase `a-z` `0-9` `-`, no leading/trailing `-`. |
| “Transaction rejected” | You denied in MetaMask | Approve the next prompt, or cancel and retry. |
| Resolve → “(no address set)” | Registered but skipped setAddr | Run **Set address to my wallet** while you own the name. |
| My Names empty / load error | RPC log limits or wrong net | Stay on testnet → **Refresh**. Indexing scans from deploy block in chunks (Ankr ~1000-block windows). |
| TX pending forever | RPC congestion / stuck nonce | Check Tamsa; bump gas or wait; ensure Ankr RPC is reachable. |

---

## 5) Done when

- [ ] At least one **register** TX on Tamsa  
- [ ] At least one **setAddr** TX on Tamsa  
- [ ] Resolve shows the correct address in the UI  
- [ ] Links pasted in section 2  
- [ ] (Optional) short recording of the 5 scenes  

Next after you’re satisfied: **Adım 12 — Mainnet deploy** (then polish UI / final video if you prefer).
