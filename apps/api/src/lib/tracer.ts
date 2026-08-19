import type {
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

/**
 * Walks the transaction graph outward from a starting wallet, hop by hop —
 * this is the "peeling chain" chase described in the problem statement.
 *
 * Breadth-first, not depth-first: we fully expand hop 1 for every wallet
 * before moving to hop 2. This matters for the demo — if TronGrid rate-limits
 * us partway through, a BFS trace still shows a complete, evenly-explored
 * picture up to whatever depth it got through, rather than one very deep
 * branch and nothing else.
 *
 * `fetchOutgoing` is injected rather than imported directly, so this
 * function can be unit-tested with a fake data source (see
 * scripts/test-tracer.ts) without hitting the real TronGrid API.
 */
export async function traceWallet(
  startAddress: string,
  fetchOutgoing: FetchOutgoingTransfers,
  options: TraceOptions = {}
): Promise<TraceResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const visited = new Set<string>([startAddress]);
  const nodes: GraphNode[] = [{ id: startAddress, depth: 0, isStartNode: true }];
  const edges: GraphEdge[] = [];

  let frontier = [startAddress];
  let depth = 0;
  let truncated = false;

  while (frontier.length > 0 && depth < opts.maxDepth) {
    const nextFrontier: string[] = [];

    for (const address of frontier) {
      if (visited.size >= opts.maxNodes) {
        truncated = true;
        break;
      }

      let transfers;
      try {
        transfers = await fetchOutgoing(address);
      } catch (err) {
        // A single wallet failing to fetch (rate limit, bad address, etc.)
        // shouldn't kill the whole trace — skip it and keep going.
        console.error(`Failed to fetch transfers for ${address}:`, err);
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

        // Cycle-safe: a wallet that already appeared anywhere in the trace
        // is not re-visited or re-expanded — its edge is still recorded
        // (so the loop is visible in the graph), it's just not walked again.
        if (!visited.has(t.to) && visited.size < opts.maxNodes) {
          visited.add(t.to);
          nodes.push({ id: t.to, depth: depth + 1, isStartNode: false });
          nextFrontier.push(t.to);
        }
      }
    }

    frontier = nextFrontier;
    depth += 1;
  }

  if (frontier.length > 0 && depth >= opts.maxDepth) {
    truncated = true;
  }

  return { nodes, edges, truncated };
}