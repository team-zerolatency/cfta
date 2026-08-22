"use client";

import Link from "next/link";
import { useState } from "react";
import {
  StatusCard,
  ThemeToggle,
  TraceInput,
  SampleWalletsCard,
  GraphView,
  RiskBadge,
  FlagWalletForm,
  ExportButton,
  type TraceResult,
  type FlagWalletSubmission,
} from "@cfta/ui";
import { buildTraceApiUrl, buildRegistryFlagUrl } from "../../lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const SAMPLE_WALLETS = [
  {
    label: "EXAMPLE — MULTI-HOP CHAIN",
    address: "TLyqzVGLV1srkB7dToTAEqgmafPtCQzy95",   // ← replace with a real address
    note: "Traces several hops with real transfer history",
  },
  {
    label: "EXAMPLE — KNOWN EXCHANGE DEPOSIT",
    address: "TDqSquXBgUCLYvYC4XZgrprLK589dkhSCf",   // ← replace with a real address
    note: "Ends in an off-ramp — shows the OFF-RAMP flag",
  },
];

export default function TracePage() {
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [flagging, setFlagging] = useState(false);
  const [flagMessage, setFlagMessage] = useState<string | null>(null);

  async function handleTrace(address: string, depth: number) {
    setLoading(true);
    setError(null);
    setTrace(null);
    setFlagMessage(null);

    try {
      const res = await fetch(buildTraceApiUrl(API_BASE_URL, address, depth));
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const data: TraceResult = await res.json();
      setTrace(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleFlagWallet(submission: FlagWalletSubmission) {
    setFlagging(true);
    setFlagMessage(null);

    try {
      const res = await fetch(buildRegistryFlagUrl(API_BASE_URL), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      setFlagMessage(`Wallet flagged to ${submission.firNumber}. Re-trace to see it surface.`);
    } catch (err) {
      setFlagMessage(err instanceof Error ? err.message : "Failed to flag wallet");
    } finally {
      setFlagging(false);
    }
  }

  const allFlags =
    trace?.nodes.flatMap((node) =>
      node.riskFlags.map((flag) => ({ flag, walletId: node.id }))
    ) ?? [];

  const crossCaseFlags = allFlags.filter(({ flag }) => flag.type === "cross-case-match");

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b border-border">
        <Link href="/" className="font-heading text-lg font-bold text-text-primary hover:text-accent transition-colors">
          CFTA
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        <div className="text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
            Trace a Wallet
          </h1>
          <p className="font-body text-text-secondary mt-2 text-sm sm:text-base">
            Enter a Tron (TRC-20) wallet address to trace its outgoing transaction chain.
          </p>
        </div>

        <TraceInput onSubmit={handleTrace} loading={loading} />
        <SampleWalletsCard wallets={SAMPLE_WALLETS}  />

        {error && (
          <div className="rounded-card border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-body text-red-400">
            {error}
          </div>
        )}

        {trace && (
          <>
            {crossCaseFlags.length > 0 && (
              <div className="rounded-card border border-amber-500/40 bg-amber-500/10 px-4 py-3">
                <p className="font-mono text-xs font-bold tracking-widest text-amber-500">
                  ⚠ CROSS-CASE MATCH
                </p>
                <p className="font-body text-sm text-text-primary mt-1">
                  {crossCaseFlags.length === 1
                    ? "A wallet in this trace was already flagged in a different case."
                    : `${crossCaseFlags.length} wallets in this trace were already flagged in other cases.`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatusCard label="Wallets Found" value={String(trace.nodes.length)} />
              <StatusCard label="Transfers Traced" value={String(trace.edges.length)} />
              <StatusCard
                label="Trace Status"
                value={trace.truncated ? "Depth limit hit" : "Fully resolved"}
              />
            </div>

            <GraphView trace={trace} />

            <ExportButton trace={trace} apiBaseUrl={API_BASE_URL} />

            {allFlags.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="font-heading text-lg font-bold text-text-primary">
                  Flags ({allFlags.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {allFlags.map(({ flag, walletId }, i) => (
                    <RiskBadge key={`${walletId}-${flag.type}-${i}`} flag={flag} walletId={walletId} />
                  ))}
                </div>
              </div>
            )}

            <FlagWalletForm
              onSubmit={handleFlagWallet}
              loading={flagging}
              defaultAddress={trace.nodes.find((n) => n.isStartNode)?.id}
            />

            {flagMessage && (
              <p className="font-body text-sm text-text-secondary">{flagMessage}</p>
            )}
          </>
        )}
      </main>
    </>
  );
}