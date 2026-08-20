import type {
  CheckExchangeWallet,
  FetchOutgoingTransfers,
  GraphEdge,
  GraphNode,
  TraceOptions,
  TraceResult,
} from "../types/trace.js";

const DEFAULT_OPTIONS: Required<TraceOptions> = {
  maxDepth: 4,
  maxNodes: 60,
  maxFanOutPerNode: 10,
};

export async function traceWallet(
  startAddress: string,
  fetchOutgoing: FetchOutgoingTransfers,
  checkExchange: CheckExchangeWallet,
  options: TraceOptions = {}
): Promise<TraceResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const visited = new Set<string>([startAddress]);
  const nodeByAddress = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  async function makeNode(address: string, depth: number, isStartNode: boolean): Promise<GraphNode> {
    const exchangeCheck = await checkExchange(address);
    const node: GraphNode = {
      id: address,
      depth,
      isStartNode,
      isExchange: exchangeCheck.isExchange,
      exchangeName: exchangeCheck.exchangeName,
      riskFlags: [],
    };
    nodeByAddress.set(address, node);
    return node;
  }

  const startNode = await makeNode(startAddress, 0, true);

  let frontier: GraphNode[] = [startNode];
  let depth = 0;
  let truncated = false;

  while (frontier.length > 0 && depth < opts.maxDepth) {
    const nextFrontier: GraphNode[] = [];

    for (const node of frontier) {
      if (visited.size >= opts.maxNodes) {
        truncated = true;
        break;
      }

      if (node.isExchange) continue;

      let transfers;
      try {
        transfers = await fetchOutgoing(node.id);
      } catch (err) {
        console.error(`Failed to fetch transfers for ${node.id}:`, err);
        continue;
      }

      const topTransfers = transfers
        .sort((a, b) => b.amount - a.amount)
        .slice(0, opts.maxFanOutPerNode);

      for (const t of topTransfers) {
        edges.push({
          id: t.transactionId,
          source: t.from,
          target: t.to,
          amount: t.amount,
          tokenSymbol: t.tokenSymbol,
          timestamp: t.blockTimestamp,
        });

        if (!visited.has(t.to) && visited.size < opts.maxNodes) {
          visited.add(t.to);
          const childNode = await makeNode(t.to, depth + 1, false);
          nextFrontier.push(childNode);
        }
      }
    }

    frontier = nextFrontier;
    depth += 1;
  }

  if (frontier.length > 0 && depth >= opts.maxDepth) {
    truncated = true;
  }

  return {
    nodes: Array.from(nodeByAddress.values()),
    edges,
    truncated,
  };
}