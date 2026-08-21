import type { GraphEdge, GraphNode, TraceResult } from "../types/trace.js";

export type ReportSummary = {
  totalWallets: number;
  totalTransfers: number;
  truncated: boolean;
  flagCount: number;
  crossCaseCount: number;
  exchangeCount: number;
};

export type ReportWalletRow = {
  address: string;
  depth: number;
  isStartNode: boolean;
  isExchange: boolean;
  exchangeName?: string;
  flagReasons: string[];
};

export type ReportEdgeRow = {
  transactionId: string;
  source: string;
  target: string;
  amount: number;
  tokenSymbol: string;
  timestampIso: string;
};

export type ReportData = {
  generatedAtIso: string;
  startAddress: string;
  summary: ReportSummary;
  wallets: ReportWalletRow[];
  transfers: ReportEdgeRow[];
};

export function buildReportData(trace: TraceResult, generatedAt: Date = new Date()): ReportData {
  const startNode = trace.nodes.find((n) => n.isStartNode);

  const wallets: ReportWalletRow[] = [...trace.nodes]
    .sort((a, b) => a.depth - b.depth)
    .map((node) => toWalletRow(node));

  const transfers: ReportEdgeRow[] = [...trace.edges]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((edge) => toEdgeRow(edge));

  const allFlags = trace.nodes.flatMap((n) => n.riskFlags);

  const summary: ReportSummary = {
    totalWallets: trace.nodes.length,
    totalTransfers: trace.edges.length,
    truncated: trace.truncated,
    flagCount: allFlags.length,
    crossCaseCount: allFlags.filter((f) => f.type === "cross-case-match").length,
    exchangeCount: trace.nodes.filter((n) => n.isExchange).length,
  };

  return {
    generatedAtIso: generatedAt.toISOString(),
    startAddress: startNode?.id ?? "UNKNOWN",
    summary,
    wallets,
    transfers,
  };
}

function toWalletRow(node: GraphNode): ReportWalletRow {
  return {
    address: node.id,
    depth: node.depth,
    isStartNode: node.isStartNode,
    isExchange: node.isExchange,
    exchangeName: node.exchangeName,
    flagReasons: node.riskFlags.map((f) => f.reason),
  };
}

function toEdgeRow(edge: GraphEdge): ReportEdgeRow {
  return {
    transactionId: edge.id,
    source: edge.source,
    target: edge.target,
    amount: edge.amount,
    tokenSymbol: edge.tokenSymbol,
    timestampIso: new Date(edge.timestamp).toISOString(),
  };
}