import { parseAbiItem, type Address, type PublicClient } from "viem";

const nameRegisteredEvent = parseAbiItem(
  "event NameRegistered(string name, bytes32 indexed labelhash, address indexed owner, uint256 fee)"
);

/** Ankr xphere_testnet rejects ranges much above ~1000 blocks. */
const LOG_CHUNK = BigInt(1000);

/**
 * Labels from NameRegistered events for `owner`, scanned in RPC-safe chunks.
 */
export async function fetchOwnedRegistrationLabels(
  client: PublicClient,
  registrar: Address,
  owner: Address,
  fromBlock: bigint
): Promise<string[]> {
  const latest = await client.getBlockNumber();
  let start = fromBlock > latest ? latest : fromBlock;

  const byLabel = new Map<string, true>();

  while (start <= latest) {
    const end = start + LOG_CHUNK - BigInt(1);
    const toBlock = end > latest ? latest : end;

    const chunk = await client.getLogs({
      address: registrar,
      event: nameRegisteredEvent,
      args: { owner },
      fromBlock: start,
      toBlock,
    });

    for (const log of chunk) {
      const name = log.args.name;
      if (typeof name === "string" && name.length > 0) {
        byLabel.set(name, true);
      }
    }

    start = toBlock + BigInt(1);
  }

  return [...byLabel.keys()].sort();
}
