import type { RiskFlag } from "@cfta/types";
import { shortenAddress } from "./lib/layoutGraph";
import { CopyButton } from "./CopyButton";

type RiskBadgeProps = {
  flag: RiskFlag;
  walletId?: string;
};

const FLAG_STYLES: Record<RiskFlag["type"], { dot: string; label: string }> = {
  "rapid-peeling": { dot: "#dc2626", label: "RISK" },
  "exchange-deposit": { dot: "#2dd4bf", label: "OFF-RAMP" },
  "cross-case-match": { dot: "#f59e0b", label: "CROSS-CASE" },
};

export function RiskBadge({ flag, walletId }: RiskBadgeProps) {
  const style = FLAG_STYLES[flag.type];

  return (
    <div className="flex items-start gap-3 rounded-card border border-border bg-card px-4 py-3">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: style.dot }} />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest" style={{ color: style.dot }}>
            {style.label}
          </span>
          {walletId && (
            <span className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-text-secondary">
                {shortenAddress(walletId)}
              </span>
              <CopyButton value={walletId} />
            </span>
          )}
        </div>
        <p className="font-body text-sm text-text-primary">{flag.reason}</p>
      </div>
    </div>
  );
}