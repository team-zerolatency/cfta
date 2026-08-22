"use client";

import { useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { layoutGraphWithDagre, shortenAddress, mergeEdgesForDisplay } from "./lib/layoutGraph";
import type { TraceResult, GraphNode } from "./lib/graphTypes";

type GraphViewProps = {
  trace: TraceResult;
};

function getNodeBorderColor(node: GraphNode): string {
  if (node.isStartNode) return "var(--color-accent)";
  if (node.riskFlags.some((f) => f.type === "cross-case-match")) return "#f59e0b";
  if (node.riskFlags.some((f) => f.type === "rapid-peeling")) return "#dc2626";
  if (node.isExchange) return "#2dd4bf";
  return "var(--color-border)";
}

export function GraphView({ trace }: GraphViewProps) {
  const nodes: Node[] = useMemo(() => {
    const positioned = layoutGraphWithDagre(trace.nodes, trace.edges);
    const seenNodeIds = new Set<string>();
    const uniqueNodes: Node[] = [];

    for (const n of positioned) {
      if (!seenNodeIds.has(n.id)) {
        seenNodeIds.add(n.id);
        uniqueNodes.push({
          id: n.id,
          position: { x: n.x, y: n.y },
          data: { label: shortenAddress(n.id) },
          style: {
            background: "var(--color-card)",
            color: "var(--color-text-primary)",
            border: `2px solid ${getNodeBorderColor(n)}`,
            borderRadius: "var(--radius-card)",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            padding: "8px 12px",
          },
        });
      }
    }

    return uniqueNodes;
  }, [trace.nodes, trace.edges]);

  const edges: Edge[] = useMemo(() => {
  const merged = mergeEdgesForDisplay(trace.edges);

  return merged.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label:
      e.transferCount > 1
        ? `${e.transferCount}× · ${e.totalAmount.toLocaleString()} ${e.tokenSymbol} total`
        : `${e.totalAmount.toLocaleString()} ${e.tokenSymbol}`,
    animated: true,
    style: { stroke: "var(--color-accent)" },
    labelStyle: { fill: "var(--color-text-secondary)", fontSize: 10 },
  }));
}, [trace.edges]);

  return (
    <div className="w-full h-[500px] rounded-card border border-border overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background color="var(--color-border)" gap={20} />
        <Controls />
        <MiniMap nodeColor="var(--color-accent)" maskColor="rgba(12, 12, 11, 0.7)" style={{ background: "var(--color-card)" }} />
      </ReactFlow>
    </div>
  );
}