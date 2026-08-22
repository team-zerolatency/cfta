"use client";

import { CopyButton } from "./CopyButton";

export type SampleWallet = {
  label: string;
  address: string;
  note?: string;
};

type SampleWalletsCardProps = {
  wallets: SampleWallet[];
};

export function SampleWalletsCard({ wallets }: SampleWalletsCardProps) {
  if (wallets.length === 0) return null;

  return (
    <div className="rounded-card border border-accent/40 bg-card p-4 flex flex-col gap-3">
      <div>
        <p className="font-heading text-sm font-bold text-text-primary">
          Try it yourself
        </p>
        <p className="font-body text-xs text-text-secondary mt-1 leading-relaxed">
          Copy one of the sample wallet addresses below, paste it into the box above,
          and click <span className="font-mono">Trace</span> — you&apos;ll see a live
          multi-hop transaction graph, risk flags, and the PDF evidence export, all
          against real on-chain data. No setup, no login required.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {wallets.map((w) => (
          <div
            key={w.address}
            className="flex items-center justify-between gap-3 rounded-card border border-border bg-bg-page px-3 py-2"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-accent">{w.label}</span>
              <span className="font-mono text-xs text-text-primary truncate">
                {w.address}
              </span>
              {w.note && (
                <span className="font-body text-[11px] text-text-secondary mt-0.5">
                  {w.note}
                </span>
              )}
            </div>
            <CopyButton value={w.address} />
          </div>
        ))}
      </div>
    </div>
  );
}