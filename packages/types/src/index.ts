export type RiskFlag = {
  type: "rapid-peeling" | "exchange-deposit" | "cross-case-match";
  reason: string;
};

export type GraphNode = {
  id: string;
  depth: number;
  isStartNode: boolean;
  isExchange: boolean;
  exchangeName?: string;
  riskFlags: RiskFlag[];
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  amount: number;
  tokenSymbol: string;
  timestamp: number;
};

export type TraceResult = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  truncated: boolean;
};