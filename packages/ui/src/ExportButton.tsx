"use client";

import { useState } from "react";
import type { TraceResult } from "./lib/graphTypes";

type ExportButtonProps = {
  trace: TraceResult;
  apiBaseUrl: string;
};

export function ExportButton({ trace, apiBaseUrl }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trace),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Export failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const startAddress = trace.nodes.find((n) => n.isStartNode)?.id ?? "trace";

      const link = document.createElement("a");
      link.href = url;
      link.download = `cfta-report-${startAddress.slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleExport}
        disabled={exporting}
        className="self-start rounded-card border border-accent px-4 py-2 text-sm font-mono font-bold text-accent disabled:opacity-50 hover:bg-accent hover:text-bg-page transition-colors"
      >
        {exporting ? "Generating PDF…" : "Export Evidence PDF"}
      </button>
      {error && <p className="font-body text-sm text-red-400">{error}</p>}
    </div>
  );
}