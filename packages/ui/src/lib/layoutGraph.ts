import type { GraphNode, PositionedNode } from "./graphTypes";

const COLUMN_WIDTH = 260;
const ROW_HEIGHT = 110;

export function layoutGraphByDepth(nodes: GraphNode[]): PositionedNode[] {
  const countPerDepth: Record<number, number> = {};

  return nodes.map((node) => {
    const rowIndex = countPerDepth[node.depth] ?? 0;
    countPerDepth[node.depth] = rowIndex + 1;

    return {
      ...node,
      x: node.depth * COLUMN_WIDTH,
      y: rowIndex * ROW_HEIGHT,
    };
  });
}

export function shortenAddress(address: string): string {
  if (address.length <= 14) return address;
  return `${address.slice(0, 7)}...${address.slice(-4)}`;
}