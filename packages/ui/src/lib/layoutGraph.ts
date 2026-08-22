import dagre from "@dagrejs/dagre";
import type { GraphEdge, GraphNode, PositionedNode } from "./graphTypes";

export type DisplayEdge = {
  id: string;
  source: string;
  target: string;
  transferCount: number;
  totalAmount: number;
  tokenSymbol: string;
  transactionIds: string[];
};


const NODE_WIDTH = 160;
const NODE_HEIGHT = 44;

export function layoutGraphWithDagre(
  nodes: GraphNode[],
  edges: GraphEdge[]
): PositionedNode[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "LR",
    nodesep: 40,
    ranksep: 120,
    marginx: 20,
    marginy: 20,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      x: pos.x - NODE_WIDTH / 2,
      y: pos.y - NODE_HEIGHT / 2,
    };
  });
}

export function shortenAddress(address: string): string {
  if (address.length <= 14) return address;
  return `${address.slice(0, 7)}...${address.slice(-4)}`;
}

export function mergeEdgesForDisplay(edges: GraphEdge[]): DisplayEdge[] {
  const groups = new Map<string, GraphEdge[]>();

  for (const edge of edges) {
    const key = `${edge.source}::${edge.target}::${edge.tokenSymbol}`;
    const group = groups.get(key);
    if (group) {
      group.push(edge);
    } else {
      groups.set(key, [edge]);
    }
  }

  return Array.from(groups.entries()).map(([key, group]) => {
    const firstEdge = group[0]!;
    return {
      id: `merged::${key}`,
      source: firstEdge.source,
      target: firstEdge.target,
      tokenSymbol: firstEdge.tokenSymbol,
      transferCount: group.length,
      totalAmount: group.reduce((sum, e) => sum + e.amount, 0),
      transactionIds: group.map((e) => e.id),
    };
  });
}