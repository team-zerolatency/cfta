import axios, { AxiosError } from "axios";
import type { Trc20Transfer } from "../types/trace.js";
import { withRetry } from "./retry.js";

const TRONGRID_BASE_URL = process.env.TRON_NETWORK_URL || "https://api.trongrid.io";

type TronGridTrc20Response = {
  data: Array<{
    transaction_id: string;
    token_info: { symbol: string; decimals: number; name: string; address: string };
    block_timestamp: number;
    from: string;
    to: string;
    type: string;
    value: string;
  }>;
  success: boolean;
  meta?: { fingerprint?: string };
};

export async function getOutgoingTrc20Transfers(
  address: string,
  limit = 50
): Promise<Trc20Transfer[]> {
  const url = `${TRONGRID_BASE_URL}/v1/accounts/${address}/transactions/trc20`;

  const { data } = await withRetry(
    () =>
      axios.get<TronGridTrc20Response>(url, {
        params: {
          only_confirmed: true,
          only_from: true,
          limit,
          order_by: "block_timestamp,desc",
        },
        headers: process.env.TRONGRID_API_KEY
          ? { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY }
          : undefined,
        timeout: 10_000,
      }),
    {
      isRetryable: (err) => err instanceof AxiosError && err.response?.status === 429,
      maxRetries: 3,
      baseDelayMs: 800,
    }
  );

  if (!data.success) return [];

  return data.data
    .filter((tx) => tx.type === "Transfer")
    .map((tx) => ({
      transactionId: tx.transaction_id,
      from: tx.from,
      to: tx.to,
      amount: Number(tx.value) / 10 ** tx.token_info.decimals,
      tokenSymbol: tx.token_info.symbol,
      blockTimestamp: tx.block_timestamp,
    }));
}