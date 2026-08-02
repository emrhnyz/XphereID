"use client";

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { zeroAddress, type Address } from "viem";
import { xphereTestnet } from "@/config/chains";
import { testnetDeployment } from "@/config/contracts";
import { xphereIdAbi } from "@/config/abis";
import { fetchOwnedRegistrationLabels } from "@/lib/fetchNameLogs";
import { myNamesQueryKey } from "@/lib/queryKeys";
import styles from "./MyNames.module.css";

const registrar = testnetDeployment.contracts.XpRegistrar as Address;
const xphereId = testnetDeployment.contracts.XphereID as Address;
const explorer = testnetDeployment.explorer;
const deployBlock = BigInt(testnetDeployment.deployBlock);

export type OwnedName = {
  label: string;
  resolved: Address | null;
};

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function MyNames() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: xphereTestnet.id });
  const onCorrectNetwork = isConnected && chainId === xphereTestnet.id;
  const queryClient = useQueryClient();

  const {
    data: names = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: myNamesQueryKey(address),
    enabled: Boolean(address && publicClient && onCorrectNetwork),
    queryFn: async (): Promise<OwnedName[]> => {
      if (!address || !publicClient) return [];

      const labels = await fetchOwnedRegistrationLabels(
        publicClient,
        registrar,
        address,
        deployBlock
      );

      const owned: OwnedName[] = [];

      for (const label of labels) {
        const owner = await publicClient.readContract({
          address: xphereId,
          abi: xphereIdAbi,
          functionName: "owner",
          args: [label],
        });
        if (owner.toLowerCase() !== address.toLowerCase()) continue;

        const resolved = await publicClient.readContract({
          address: xphereId,
          abi: xphereIdAbi,
          functionName: "resolve",
          args: [label],
        });

        owned.push({
          label,
          resolved: resolved && resolved !== zeroAddress ? resolved : null,
        });
      }

      return owned;
    },
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: myNamesQueryKey(address) });
    void refetch();
  }, [address, queryClient, refetch]);

  if (!isConnected) {
    return (
      <section className={styles.section} aria-label="My Names">
        <div className={styles.head}>
          <h2 className={styles.heading}>My Names</h2>
        </div>
        <p className={styles.empty}>Connect wallet to see your names.</p>
      </section>
    );
  }

  if (!onCorrectNetwork) {
    return (
      <section className={styles.section} aria-label="My Names">
        <div className={styles.head}>
          <h2 className={styles.heading}>My Names</h2>
        </div>
        <p className={styles.empty}>Switch to Xphere Testnet to load names.</p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="My Names">
      <div className={styles.head}>
        <h2 className={styles.heading}>My Names</h2>
        <button
          type="button"
          className={styles.refresh}
          onClick={refresh}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {isLoading ? (
        <p className={styles.empty}>Loading…</p>
      ) : error ? (
        <p className={styles.error}>
          Could not load names from chain events. Try Refresh.
        </p>
      ) : names.length === 0 ? (
        <p className={styles.empty}>Henüz ismin yok</p>
      ) : (
        <ul className={styles.list}>
          {names.map((item) => (
            <NameRow key={item.label} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}

function NameRow({ item }: { item: OwnedName }) {
  const [copied, setCopied] = useState(false);
  const fullName = `${item.label}.xp`;
  const resolved = item.resolved;

  async function onCopy() {
    if (!resolved) return;
    try {
      await navigator.clipboard.writeText(resolved);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }

  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <span className={styles.name}>{fullName}</span>
        <span className={styles.addr}>
          {resolved ? shortAddress(resolved) : "No address set"}
        </span>
      </div>
      <div className={styles.actions}>
        {resolved ? (
          <>
            <button type="button" className={styles.action} onClick={onCopy}>
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              className={styles.action}
              href={`${explorer}/address/${resolved}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorer
            </a>
          </>
        ) : null}
      </div>
    </li>
  );
}
