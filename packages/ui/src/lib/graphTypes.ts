import type { GraphNode } from "@cfta/types";

export type { GraphNode, GraphEdge, TraceResult, RiskFlag } from "@cfta/types";

export type PositionedNode = GraphNode & {
  x: number;
  y: number;
};