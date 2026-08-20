export type GraphNode = {
  id: string;
  depth: number;
  isStartNode: boolean;
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

export type PositionedNode = GraphNode & {
  x: number;
  y: number;
};