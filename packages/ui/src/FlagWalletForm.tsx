"use client";

import { useState, type FormEvent } from "react";

export type FlagWalletSubmission = {
  address: string;
  firNumber: string;
  reason?: string;
};

type FlagWalletFormProps = {
  onSubmit: (data: FlagWalletSubmission) => void;
  loading?: boolean;
  defaultAddress?: string;
};

export function FlagWalletForm({ onSubmit, loading, defaultAddress }: FlagWalletFormProps) {
  const [address, setAddress] = useState(defaultAddress ?? "");
  const [firNumber, setFirNumber] = useState("");
  const [reason, setReason] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address.trim() || !firNumber.trim()) return;
    onSubmit({
      address: address.trim(),
      firNumber: firNumber.trim(),
      reason: reason.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-card border border-border bg-card p-4">
      <p className="font-heading text-sm font-bold text-text-primary">Flag this wallet to a case</p>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Wallet address"
        className="rounded-card border border-border bg-bg-page px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
      />
      <input
        value={firNumber}
        onChange={(e) => setFirNumber(e.target.value)}
        placeholder="FIR number (e.g. FIR-2026-0142)"
        className="rounded-card border border-border bg-bg-page px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
      />
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="rounded-card border border-border bg-bg-page px-3 py-2 text-sm font-body text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
      />

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-card bg-accent px-4 py-2 text-sm font-mono font-bold text-bg-page disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? "Flagging…" : "Flag Wallet"}
      </button>
    </form>
  );
}