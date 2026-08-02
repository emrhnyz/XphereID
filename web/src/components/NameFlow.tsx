"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { zeroAddress, type Hash } from "viem";
import { activeChain, activeDeployment } from "@/config/active";
import {
  publicResolverAbi,
  xpRegistrarAbi,
  xphereIdAbi,
} from "@/config/abis";
import { formatTxError, isValidLabel, normalizeLabel } from "@/lib/label";
import { ensureActiveXphereChain } from "@/lib/network";
import { myNamesQueryKey } from "@/lib/queryKeys";
import styles from "./NameFlow.module.css";

const registrar = activeDeployment.contracts.XpRegistrar as `0x${string}`;
const resolver = activeDeployment.contracts.PublicResolver as `0x${string}`;
const xphereId = activeDeployment.contracts.XphereID as `0x${string}`;
const priceWei = BigInt(activeDeployment.registerPriceWei);

export function NameFlow() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const onCorrectNetwork = isConnected && chainId === activeChain.id;

  const [rawLabel, setRawLabel] = useState("");
  const [resolveRaw, setResolveRaw] = useState("");
  const [resolveQuery, setResolveQuery] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const label = useMemo(() => normalizeLabel(rawLabel), [rawLabel]);
  const labelOk = isValidLabel(label);
  const resolveLabel = useMemo(
    () => normalizeLabel(resolveQuery),
    [resolveQuery]
  );
  const resolveLabelOk = isValidLabel(resolveLabel);

  const {
    data: available,
    isFetching: checkingAvailable,
    error: availableError,
    refetch: refetchAvailable,
  } = useReadContract({
    address: registrar,
    abi: xpRegistrarAbi,
    functionName: "available",
    args: [label],
    query: {
      enabled: onCorrectNetwork && labelOk,
    },
  });

  const { data: nameOwner, refetch: refetchOwner } = useReadContract({
    address: xphereId,
    abi: xphereIdAbi,
    functionName: "owner",
    args: [label],
    query: {
      enabled: onCorrectNetwork && labelOk,
    },
  });

  const { data: nameNode } = useReadContract({
    address: registrar,
    abi: xpRegistrarAbi,
    functionName: "namehashOf",
    args: [label],
    query: {
      enabled: labelOk,
    },
  });

  const { data: labelResolved, refetch: refetchLabelResolved } = useReadContract({
    address: xphereId,
    abi: xphereIdAbi,
    functionName: "resolve",
    args: [label],
    query: {
      enabled: onCorrectNetwork && labelOk,
    },
  });

  const {
    writeContract: writeRegister,
    data: registerHash,
    isPending: registerPending,
    reset: resetRegister,
  } = useWriteContract();

  const {
    writeContract: writeSetAddr,
    data: setAddrHash,
    isPending: setAddrPending,
    reset: resetSetAddr,
  } = useWriteContract();

  const registerTx = useWaitForTransactionReceipt({ hash: registerHash });
  const setAddrTx = useWaitForTransactionReceipt({ hash: setAddrHash });

  const {
    data: resolved,
    isFetching: resolving,
    error: resolveError,
    refetch: refetchResolve,
  } = useReadContract({
    address: xphereId,
    abi: xphereIdAbi,
    functionName: "resolve",
    args: [resolveLabel],
    query: {
      enabled: resolveLabelOk,
    },
  });

  useEffect(() => {
    if (registerTx.isSuccess) {
      setJustRegistered(true);
      setSuccessNote(`Registered ${label}.xp`);
      setActionError(null);
      void refetchAvailable();
      void refetchOwner();
      void refetchLabelResolved();
      void queryClient.invalidateQueries({ queryKey: myNamesQueryKey(address) });
    }
  }, [
    registerTx.isSuccess,
    label,
    refetchAvailable,
    refetchOwner,
    refetchLabelResolved,
    queryClient,
    address,
  ]);

  useEffect(() => {
    if (setAddrTx.isSuccess) {
      setSuccessNote(`Address set for ${label}.xp`);
      setActionError(null);
      setJustRegistered(false);
      void refetchLabelResolved();
      if (resolveLabel === label) {
        void refetchResolve();
      }
      void queryClient.invalidateQueries({ queryKey: myNamesQueryKey(address) });
    }
  }, [
    setAddrTx.isSuccess,
    label,
    resolveLabel,
    refetchResolve,
    refetchLabelResolved,
    queryClient,
    address,
  ]);

  const isOwner =
    !!address &&
    !!nameOwner &&
    nameOwner.toLowerCase() === address.toLowerCase();

  const alreadySetToWallet =
    !!address &&
    !!labelResolved &&
    labelResolved !== zeroAddress &&
    labelResolved.toLowerCase() === address.toLowerCase();

  // Offer setAddr only if we own the name and it is not already our address.
  const canSetAddr =
    onCorrectNetwork &&
    labelOk &&
    (justRegistered || isOwner) &&
    !alreadySetToWallet;

  async function onSwitchNetwork() {
    setActionError(null);
    try {
      await ensureActiveXphereChain();
    } catch (err) {
      setActionError(formatTxError(err));
    }
  }

  async function onRegister() {
    setActionError(null);
    setSuccessNote(null);
    resetRegister();

    if (!isConnected) {
      setActionError("Connect your wallet first.");
      return;
    }
    if (!labelOk) {
      setActionError("Invalid name. Use 3–32 chars: a–z, 0–9, hyphen.");
      return;
    }
    if (available === false) {
      setActionError("That name is already taken.");
      return;
    }

    try {
      await ensureActiveXphereChain();
    } catch (err) {
      setActionError(formatTxError(err));
      return;
    }

    writeRegister(
      {
        address: registrar,
        abi: xpRegistrarAbi,
        functionName: "register",
        args: [label],
        value: priceWei,
      },
      {
        onError: (err) => setActionError(formatTxError(err)),
      }
    );
  }

  async function onSetAddr() {
    setActionError(null);
    setSuccessNote(null);
    resetSetAddr();

    if (!address) {
      setActionError("Connect your wallet first.");
      return;
    }
    if (!nameNode) {
      setActionError("Could not compute namehash.");
      return;
    }

    try {
      await ensureActiveXphereChain();
    } catch (err) {
      setActionError(formatTxError(err));
      return;
    }

    writeSetAddr(
      {
        address: resolver,
        abi: publicResolverAbi,
        functionName: "setAddr",
        args: [nameNode, address],
      },
      {
        onError: (err) => setActionError(formatTxError(err)),
      }
    );
  }

  function onResolveSubmit(e: FormEvent) {
    e.preventDefault();
    const next = normalizeLabel(resolveRaw);
    setResolveQuery(next);
    setActionError(null);
    if (!isValidLabel(next)) {
      setActionError("Invalid name. Use 3–32 chars: a–z, 0–9, hyphen.");
    }
  }

  const statusText = (() => {
    if (!label) return "Type a name to check availability.";
    if (!labelOk) return "Invalid — 3–32 chars, a–z / 0–9 / hyphen.";
    if (!onCorrectNetwork) return `Connect on ${activeChain.name} to check.`;
    if (checkingAvailable) return "Checking…";
    if (availableError) return formatTxError(availableError);
    if (available === true) return "Available";
    if (available === false) return "Taken";
    return "—";
  })();

  const statusTone =
    available === true ? styles.ok : available === false ? styles.taken : "";

  const busy =
    registerPending ||
    setAddrPending ||
    registerTx.isLoading ||
    setAddrTx.isLoading;

  return (
    <section className={styles.section} aria-label="Name search and resolve">
      <div id="register" className={styles.panel}>
        <div className={styles.panelHead}>
          <h2 className={styles.heading}>Search &amp; register</h2>
          <p className={styles.sub}>Find a .xp name and claim it on-chain.</p>
        </div>
        <label className={styles.label} htmlFor="name-input">
          Name
        </label>
        <div className={styles.searchShell}>
          <input
            id="name-input"
            className={styles.input}
            value={rawLabel}
            onChange={(e) => {
              setRawLabel(e.target.value);
              setJustRegistered(false);
              setActionError(null);
              setSuccessNote(null);
            }}
            placeholder="yourname"
            autoComplete="off"
            spellCheck={false}
          />
          <span className={styles.suffix}>.xp</span>
        </div>
        <p className={`${styles.status} ${statusTone}`}>{statusText}</p>

        <div className={styles.actions}>
          {isConnected && !onCorrectNetwork ? (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => void onSwitchNetwork()}
            >
              Switch to {activeChain.name}
            </button>
          ) : null}

          {available === true && onCorrectNetwork ? (
            <button
              type="button"
              className={styles.primary}
              disabled={busy}
              onClick={() => void onRegister()}
            >
              {registerPending || registerTx.isLoading
                ? "Confirm in wallet…"
                : `Register · ${activeDeployment.registerPriceNative} ${activeDeployment.nativeSymbol} + gas`}
            </button>
          ) : null}

          {canSetAddr ? (
            <button
              type="button"
              className={styles.secondary}
              disabled={busy || !address}
              onClick={() => void onSetAddr()}
            >
              {setAddrPending || setAddrTx.isLoading
                ? "Confirm in wallet…"
                : "Set address to my wallet"}
            </button>
          ) : null}
        </div>

        {registerHash ? (
          <TxLink hash={registerHash} label="Register tx" />
        ) : null}
        {setAddrHash ? <TxLink hash={setAddrHash} label="SetAddr tx" /> : null}
      </div>

      <div id="resolve" className={styles.panel}>
        <div className={styles.panelHead}>
          <h2 className={styles.heading}>Resolve</h2>
          <p className={styles.sub}>Look up which address a name points to.</p>
        </div>
        <form onSubmit={onResolveSubmit} className={styles.resolveForm}>
          <label className={styles.label} htmlFor="resolve-input">
            Name
          </label>
          <div className={styles.searchShell}>
            <input
              id="resolve-input"
              className={styles.input}
              value={resolveRaw}
              onChange={(e) => setResolveRaw(e.target.value)}
              placeholder="yourname"
              autoComplete="off"
              spellCheck={false}
            />
            <span className={styles.suffix}>.xp</span>
          </div>
          <button type="submit" className={styles.secondary}>
            Resolve
          </button>
        </form>
        {resolveLabelOk ? (
          <p className={styles.resolveResult}>
            {resolving
              ? "Looking up…"
              : resolveError
                ? formatTxError(resolveError)
                : resolved && resolved !== zeroAddress
                  ? `${resolveLabel}.xp → ${resolved}`
                  : `${resolveLabel}.xp → (no address set)`}
          </p>
        ) : null}
      </div>

      {actionError ? <p className={styles.error}>{actionError}</p> : null}
      {successNote ? <p className={styles.success}>{successNote}</p> : null}
    </section>
  );
}

function TxLink({ hash, label }: { hash: Hash; label: string }) {
  const href = `${activeDeployment.explorer}/tx/${hash}`;
  return (
    <p className={styles.tx}>
      {label}:{" "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {hash.slice(0, 10)}…
      </a>
    </p>
  );
}
