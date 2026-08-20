"use client";

import { useState, type FormEvent } from "react";

type TraceInputProps = {
  onSubmit: (address: string, depth: number) => void;
  loading?: boolean;
};

export function TraceInput({ onSubmit, loading }: TraceInputProps) {
  const [address, setAddress] = useState("");
  const [depth, setDepth] = useState(4);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;
    onSubmit(address.trim(), depth);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter a Tron wallet address (T...)"
        className="flex-1 rounded-card border border-border bg-card px-4 py-2 text-sm font-mono text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
      />

      <select
        value={depth}
        onChange={(e) => setDepth(Number(e.target.value))}
        className="rounded-card border border-border bg-card px-3 py-2 text-sm font-mono text-text-secondary focus:outline-none focus:border-accent"
      >
        {[2, 3, 4, 5, 6, 8].map((d) => (
          <option key={d} value={d}>
            {d} hops
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="rounded-card bg-accent px-5 py-2 text-sm font-mono font-bold text-bg-page disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? "Tracing…" : "Trace"}
      </button>
    </form>
  );
}