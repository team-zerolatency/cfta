import { traceWallet } from "../src/lib/tracer.js";
import type { Trc20Transfer, FetchOutgoingTransfers, CheckExchangeWallet } from "../src/types/trace.js";

// START --> MULE --> HOT_WALLET (a known exchange) --> [should NEVER be reached]
// This simulates the exact real-world case: a scam wallet's funds land in
// a known exchange deposit wallet. The trace should show that the funds
// REACHED the exchange, but must not try to expand outward from it —
// that's both semantically wrong (what happens after is off-chain) and
// the actual fix for the dense-fanout bug (a real exchange hot wallet
// might have hundreds of its own outgoing transfers).
const FAKE_CHAIN: Record<string, Trc20Transfer[]> = {
  START: [mockTransfer("tx1", "START", "MULE")],
  MULE: [mockTransfer("tx2", "MULE", "HOT_WALLET")],
  HOT_WALLET: [mockTransfer("tx3", "HOT_WALLET", "SHOULD_NEVER_BE_REACHED")],
};

function mockTransfer(id: string, from: string, to: string): Trc20Transfer {
  return { transactionId: id, from, to, amount: 5000, tokenSymbol: "USDT", blockTimestamp: Date.now() };
}

const fakeFetcher: FetchOutgoingTransfers = async (address) => {
  return FAKE_CHAIN[address] ?? [];
};

const checkExchange: CheckExchangeWallet = async (address) => {
  if (address === "HOT_WALLET") {
    return { isExchange: true, exchangeName: "Demo Exchange" };
  }
  return { isExchange: false };
};

async function main() {
  const graph = await traceWallet("START", fakeFetcher, checkExchange, { maxDepth: 8 });
  const addresses = graph.nodes.map((n) => n.id);
  const hotWalletNode = graph.nodes.find((n) => n.id === "HOT_WALLET");

  const checks: Array<[string, boolean]> = [
    ["START, MULE, and HOT_WALLET are all present", ["START", "MULE", "HOT_WALLET"].every((a) => addresses.includes(a))],
    ["the edge INTO the exchange (MULE -> HOT_WALLET) is recorded", graph.edges.some((e) => e.source === "MULE" && e.target === "HOT_WALLET")],
    ["HOT_WALLET is tagged isExchange: true", hotWalletNode?.isExchange === true],
    ["HOT_WALLET has the correct exchangeName", hotWalletNode?.exchangeName === "Demo Exchange"],
    ["SHOULD_NEVER_BE_REACHED is absent — tracer did not expand the exchange node", !addresses.includes("SHOULD_NEVER_BE_REACHED")],
    ["no edge originates FROM the exchange wallet", !graph.edges.some((e) => e.source === "HOT_WALLET")],
    ["exactly 2 edges total (not 3 — the exchange's outgoing edge was never fetched)", graph.edges.length === 2],
  ];

  let allPassed = true;
  for (const [label, passed] of checks) {
    console.log(passed ? `✅ ${label}` : `❌ ${label}`);
    if (!passed) allPassed = false;
  }
  process.exit(allPassed ? 0 : 1);
}

main();