"use client";

import { useState } from "react";
import { StatusCard, ThemeToggle, TraceInput, GraphView, type TraceResult } from "@cfta/ui";
import { buildTraceApiUrl } from "../lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Home() {
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTrace(address: string, depth: number) {
    setLoading(true);
    setError(null);
    setTrace(null);

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

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b border-border">
        <span className="font-heading text-lg font-bold text-text-primary">CFTA</span>
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

        {error && (
          <div className="rounded-card border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-body text-red-400">
            {error}
          </div>
        )}

        {trace && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatusCard label="Wallets Found" value={String(trace.nodes.length)} />
              <StatusCard label="Transfers Traced" value={String(trace.edges.length)} />
              <StatusCard label="Trace Status" value={trace.truncated ? "Depth limit hit" : "Fully resolved"} />
            </div>

            <GraphView trace={trace} />
          </>
        )}
      </main>
    </>
  );
}