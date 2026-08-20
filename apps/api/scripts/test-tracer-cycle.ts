import { traceWallet } from "../src/lib/tracer.js";
import type { Trc20Transfer, FetchOutgoingTransfers, CheckExchangeWallet } from "../src/types/trace.js";

const FAKE_CHAIN: Record<string, Trc20Transfer[]> = {
  START: [mockTransfer("tx1", "START", "WALLET_A")],
  WALLET_A: [mockTransfer("tx2", "WALLET_A", "WALLET_B")],
  WALLET_B: [mockTransfer("tx3", "WALLET_B", "START")],
};

function mockTransfer(id: string, from: string, to: string): Trc20Transfer {
  return { transactionId: id, from, to, amount: 500, tokenSymbol: "USDT", blockTimestamp: Date.now() };
}

const fakeFetcher: FetchOutgoingTransfers = async (address) => FAKE_CHAIN[address] ?? [];
const noExchanges: CheckExchangeWallet = async () => ({ isExchange: false });

async function main() {
  const start = Date.now();
  const graph = await traceWallet("START", fakeFetcher, noExchanges, { maxDepth: 10 });
  const elapsedMs = Date.now() - start;
  const addresses = graph.nodes.map((n) => n.id);

  const checks: Array<[string, boolean]> = [
    ["completed without hanging (< 2s)", elapsedMs < 2000],
    ["START appears exactly once as a node", addresses.filter((a) => a === "START").length === 1],
    ["all 3 wallets present", ["START", "WALLET_A", "WALLET_B"].every((a) => addresses.includes(a))],
    ["the cycle edge B -> START is still recorded", graph.edges.some((e) => e.source === "WALLET_B" && e.target === "START")],
    ["exactly 3 edges total (not infinite)", graph.edges.length === 3],
  ];

  let allPassed = true;
  for (const [label, passed] of checks) {
    console.log(passed ? `✅ ${label}` : `❌ ${label}`);
    if (!passed) allPassed = false;
  }

  process.exit(allPassed ? 0 : 1);
}

main();