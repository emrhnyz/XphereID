# XphereID — Web guide

Frontend for the XphereID `.xp` name service.

## Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set network in `.env.local`:

```
NEXT_PUBLIC_NETWORK=mainnet
# or testnet
```

## User flow

1. **Connect Wallet** on Xphere (testnet or mainnet per env).
2. **Search** a label — UI adds `.xp` — see Available / Taken.
3. **Register** (fee + gas), then **Set address to my wallet**.
4. **Resolve** a name to an address.
5. **My Names** lists your names (event index). Unset names can set address there.
6. **Marketplace** is listed as coming soon (closed).

## Notes

- Labels: 3–32 chars, `a-z` `0-9` `-`, no leading/trailing hyphen.
- Addresses: `src/config/contracts.ts`.
