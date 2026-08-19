// A single TRC-20 transfer, as returned by TronGrid, normalized to the
// fields the tracer actually needs.
export type Trc20Transfer = {
  transactionId: string;
  from: string;
  to: string;
  /** Human-readable amount, already divided by the token's decimals */
  amount: number;
  tokenSymbol: string;
  blockTimestamp: number; // epoch ms
};

// One wallet node in the traced graph.
export type GraphNode = {
  id: string; // wallet address
  depth: number;
  isStartNode: boolean;
};

// One transfer edge between two wallets in the traced graph.
export type GraphEdge = {
  id: string; // transactionId
  source: string; // from address
  target: string; // to address
  amount: number;
  tokenSymbol: string;
  timestamp: number;
};

export type TraceResult = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  truncated: boolean; // hit maxNodes or maxDepth before fully exploring
};

export type TraceOptions = {
  maxDepth?: number; // how many hops to follow, default 4
  maxNodes?: number; // safety cap on total wallets visited, default 60
  maxFanOutPerNode?: number; // cap outgoing edges followed per wallet, default 10
};

// The tracer depends on this function shape, not on TronGrid directly —
// lets us inject a fake one in tests, and swap providers later if needed.
export type FetchOutgoingTransfers = (address: string) => Promise<Trc20Transfer[]>;