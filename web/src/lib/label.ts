/** Match XpRegistrar._validLabel: 3–32 chars, [a-z0-9-], no leading/trailing hyphen. */
export function normalizeLabel(raw: string): string {
  let value = raw.trim().toLowerCase();
  if (value.endsWith(".xp")) {
    value = value.slice(0, -3);
  }
  return value;
}

export function isValidLabel(label: string): boolean {
  if (label.length < 3 || label.length > 32) return false;
  if (label.startsWith("-") || label.endsWith("-")) return false;
  return /^[a-z0-9-]+$/.test(label);
}

export function formatTxError(err: unknown): string {
  const message =
    err && typeof err === "object" && "shortMessage" in err
      ? String((err as { shortMessage?: string }).shortMessage)
      : err instanceof Error
        ? err.message
        : String(err);

  const lower = message.toLowerCase();

  if (
    lower.includes("user rejected") ||
    lower.includes("rejected the request") ||
    lower.includes("denied transaction") ||
    lower.includes("user denied")
  ) {
    return "Transaction rejected in wallet.";
  }

  if (
    lower.includes("wrong network") ||
    lower.includes("chain mismatch") ||
    lower.includes("expected chain") ||
    lower.includes("does not match the target chain") ||
    lower.includes("current chain of the wallet")
  ) {
    return "Wrong network. Click “Switch to Xphere Testnet” (MetaMask will offer to add it if missing).";
  }

  if (lower.includes("taken")) {
    return "That name is already taken.";
  }

  if (lower.includes("invalid label")) {
    return "Invalid name. Use 3–32 chars: a–z, 0–9, hyphen.";
  }

  if (
    lower.includes("insufficient funds") ||
    lower.includes("insufficient balance") ||
    lower.includes("exceeds the balance")
  ) {
    return "Insufficient XPT for fee + gas.";
  }

  if (lower.includes("insufficient fee")) {
    return "Fee too low. Send the required registration price.";
  }

  return message.length > 160 ? `${message.slice(0, 160)}…` : message;
}
