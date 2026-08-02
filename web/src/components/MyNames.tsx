"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { zeroAddress, type Address, type Hash } from "viem";
import { activeChain, activeDeployment } from "@/config/active";
import {
  publicResolverAbi,
  xpRegistrarAbi,
  xphereIdAbi,
} from "@/config/abis";
import { fetchOwnedRegistrationLabels } from "@/lib/fetchNameLogs";
import { formatTxError } from "@/lib/label";
import { ensureActiveXphereChain } from "@/lib/network";
import { myNamesQueryKey } from "@/lib/queryKeys";
import styles from "./MyNames.module.css";

const registrar = activeDeployment.contracts.XpRegistrar as Address;
const resolver = activeDeployment.contracts.PublicResolver as Address;
const xphereId = activeDeployment.contracts.XphereID as Address;
const explorer = activeDeployment.explorer;
const deployBlock = BigInt(activeDeployment.deployBlock);

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
  const publicClient = usePublicClient({ chainId: activeChain.id });
  const onCorrectNetwork = isConnected && chainId === activeChain.id;
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
        <p className={styles.empty}>Switch to {activeChain.name} to load names.</p>
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
            <NameRow
              key={item.label}
              item={item}
              wallet={address}
              onUpdated={refresh}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function NameRow({
  item,
  wallet,
  onUpdated,
}: {
  item: OwnedName;
  wallet: Address | undefined;
  onUpdated: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const fullName = `${item.label}.xp`;
  const resolved = item.resolved;
  const needsSet = !resolved;

  const { data: nameNode } = useReadContract({
    address: registrar,
    abi: xpRegistrarAbi,
    functionName: "namehashOf",
    args: [item.label],
    query: { enabled: needsSet },
  });

  const {
    writeContract,
    data: txHash,
    isPending,
    reset,
  } = useWriteContract();

  const setAddrTx = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (setAddrTx.isSuccess) {
      setRowError(null);
      onUpdated();
    }
  }, [setAddrTx.isSuccess, onUpdated]);

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

  async function onSetAddr() {
    setRowError(null);
    reset();

    if (!wallet) {
      setRowError("Connect your wallet first.");
      return;
    }
    if (!nameNode) {
      setRowError("Could not compute namehash.");
      return;
    }

    try {
      await ensureActiveXphereChain();
    } catch (err) {
      setRowError(formatTxError(err));
      return;
    }

    writeContract(
      {
        address: resolver,
        abi: publicResolverAbi,
        functionName: "setAddr",
        args: [nameNode, wallet],
      },
      {
        onError: (err) => setRowError(formatTxError(err)),
      }
    );
  }

  const busy = isPending || setAddrTx.isLoading;

  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <span className={styles.name}>{fullName}</span>
        <span className={styles.addr}>
          {resolved ? shortAddress(resolved) : "No address set"}
        </span>
        {rowError ? <p className={styles.rowError}>{rowError}</p> : null}
        {txHash ? <TxLink hash={txHash} /> : null}
      </div>
      <div className={styles.actions}>
        {needsSet ? (
          <button
            type="button"
            className={styles.setBtn}
            disabled={busy || !wallet}
            onClick={() => void onSetAddr()}
          >
            {busy ? "Confirm in wallet…" : "Set address to my wallet"}
          </button>
        ) : (
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
        )}
      </div>
    </li>
  );
}

function TxLink({ hash }: { hash: Hash }) {
  return (
    <a
      className={styles.tx}
      href={`${explorer}/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      setAddr tx {hash.slice(0, 10)}…
    </a>
  );
}
