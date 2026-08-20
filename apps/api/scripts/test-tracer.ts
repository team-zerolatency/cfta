import { traceWallet } from "../src/lib/tracer.js";
import type {
  Trc20Transfer,
  FetchOutgoingTransfers,
  CheckExchangeWallet,
} from "../src/types/trace.js";

// Simulated wallet graph:
//   START --> A --> B --> C --> D   (D is hop 4, the max depth — should appear)
//         \-> E                     (second outgoing txn from START, tests fan-out)
//   D --> SHOULD_NOT_APPEAR         (would be hop 5, beyond the depth cap)
const FAKE_CHAIN: Record<string, Trc20Transfer[]> = {
  START: [mockTransfer("tx1", "START", "WALLET_A"), mockTransfer("tx2", "START", "WALLET_E")],
  WALLET_A: [mockTransfer("tx3", "WALLET_A", "WALLET_B")],
  WALLET_B: [mockTransfer("tx4", "WALLET_B", "WALLET_C")],
  WALLET_C: [mockTransfer("tx5", "WALLET_C", "WALLET_D")],
  WALLET_D: [mockTransfer("tx6", "WALLET_D", "SHOULD_NOT_APPEAR")],
};

function mockTransfer(id: string, from: string, to: string): Trc20Transfer {
  return {
    transactionId: id,
    from,
    to,
    amount: 1000,
    tokenSymbol: "USDT",
    blockTimestamp: Date.now(),
  };
}

const fakeFetcher: FetchOutgoingTransfers = async (address) => FAKE_CHAIN[address] ?? [];

// Mock exchange checker for unit test (no exchange wallets in this basic test)
const fakeCheckExchange: CheckExchangeWallet = async () => ({
  isExchange: false,
});

async function main() {
  // Pass fakeCheckExchange to satisfy the new signature
  const graph = await traceWallet("START", fakeFetcher, fakeCheckExchange, { maxDepth: 4 });

  console.log("Nodes:", graph.nodes);
  console.log(
    "Edges:",
    graph.edges.map((e) => `${e.source} -> ${e.target}`)
  );

  const addresses = graph.nodes.map((n) => n.id);

  const checks: Array<[string, boolean]> = [
    ["START is present", addresses.includes("START")],
    ["WALLET_A is present (hop 1)", addresses.includes("WALLET_A")],
    ["WALLET_E is present (fan-out, hop 1)", addresses.includes("WALLET_E")],
    ["WALLET_D is present (hop 4, at max depth)", addresses.includes("WALLET_D")],
    [
      "SHOULD_NOT_APPEAR is absent (would be hop 5, beyond depth cap)",
      !addresses.includes("SHOULD_NOT_APPEAR"),
    ],
    ["exactly 5 edges recorded", graph.edges.length === 5],
    ["WALLET_D's depth is 4", graph.nodes.find((n) => n.id === "WALLET_D")?.depth === 4],
    ["truncated flag is true (depth cap was hit)", graph.truncated === true],
  ];

  let allPassed = true;
  for (const [label, passed] of checks) {
    console.log(passed ? `✅ ${label}` : `❌ ${label}`);
    if (!passed) allPassed = false;
  }

  process.exit(allPassed ? 0 : 1);
}

main();