import type { GraphNode, GraphEdge, TraceResult } from "@cfta/types";

export type { GraphNode, GraphEdge, TraceResult, RiskFlag } from "@cfta/types";

export type Trc20Transfer = {
  transactionId: string;
  from: string;
  to: string;
  amount: number;
  tokenSymbol: string;
  blockTimestamp: number;
};

export type TraceOptions = {
  maxDepth?: number;
  maxNodes?: number;
  maxFanOutPerNode?: number;
};

export type FetchOutgoingTransfers = (address: string) => Promise<Trc20Transfer[]>;

export type CheckExchangeWallet = (
  address: string
) => Promise<{ isExchange: boolean; exchangeName?: string }>;

export type CheckCrossCaseWallet = (address: string) => Promise<{ firNumbers: string[] }>;