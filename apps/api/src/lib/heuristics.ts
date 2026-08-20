import type { GraphEdge, GraphNode, RiskFlag } from "../types/trace.js";

const RAPID_PEELING_MIN_OUT_DEGREE = 5;
const RAPID_PEELING_WINDOW_MS = 10 * 60 * 1000;

export function detectRapidPeeling(nodeId: string, edges: GraphEdge[]): RiskFlag | null {
  const outgoing = edges.filter((e) => e.source === nodeId);
  if (outgoing.length < RAPID_PEELING_MIN_OUT_DEGREE) return null;

  const timestamps = outgoing.map((e) => e.timestamp).sort((a, b) => a - b);
  const first = timestamps[0];
  const last = timestamps[timestamps.length - 1];

  if (first === undefined || last === undefined) return null;

  const windowMs = last - first;

  if (windowMs > RAPID_PEELING_WINDOW_MS) return null;

  const minutes = Math.max(1, Math.round(windowMs / 60000));
  return {
    type: "rapid-peeling",
    reason: `${outgoing.length} outbound transfers within ${minutes} minute${minutes === 1 ? "" : "s"}`,
  };
}

export function detectExchangeDeposit(node: GraphNode): RiskFlag | null {
  if (!node.isExchange) return null;
  return {
    type: "exchange-deposit",
    reason: node.exchangeName
      ? `Funds reached a known ${node.exchangeName} deposit wallet`
      : "Funds reached a known exchange deposit wallet",
  };
}

export function evaluateNode(node: GraphNode, edges: GraphEdge[]): RiskFlag[] {
  const flags: RiskFlag[] = [];

  const rapidPeeling = detectRapidPeeling(node.id, edges);
  if (rapidPeeling) flags.push(rapidPeeling);

  const exchangeDeposit = detectExchangeDeposit(node);
  if (exchangeDeposit) flags.push(exchangeDeposit);

  return flags;
}