"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
} from "wagmi";
import { xphereTestnet } from "@/config/chains";
import { ensureXphereTestnet } from "@/lib/network";
import { formatTxError } from "@/lib/label";
import styles from "./ConnectWallet.module.css";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function ConnectWallet() {
  const { address, isConnected, status } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [switching, setSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const onWrongNetwork = isConnected && chainId !== xphereTestnet.id;
  const connector = connectors[0];

  async function onSwitch() {
    setSwitchError(null);
    setSwitching(true);
    try {
      await ensureXphereTestnet();
    } catch (err) {
      setSwitchError(formatTxError(err));
    } finally {
      setSwitching(false);
    }
  }

  function onConnect() {
    if (!connector) return;
    connect({
      connector,
      chainId: xphereTestnet.id,
    });
  }

  if (isConnected && address) {
    return (
      <div className={styles.wrap}>
        {onWrongNetwork ? (
          <button
            type="button"
            className={styles.warn}
            disabled={switching}
            onClick={() => void onSwitch()}
          >
            {switching ? "Switching…" : "Switch to Xphere Testnet"}
          </button>
        ) : (
          <p className={styles.network}>
            Xphere Testnet · {shortAddress(address)}
          </p>
        )}
        <button
          type="button"
          className={styles.ghost}
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
        {switchError ? <p className={styles.error}>{switchError}</p> : null}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.primary}
        disabled={!connector || isPending || status === "connecting"}
        onClick={onConnect}
      >
        {isPending || status === "connecting"
          ? "Connecting…"
          : "Connect Wallet"}
      </button>
      {error ? <p className={styles.error}>{error.message}</p> : null}
    </div>
  );
}
