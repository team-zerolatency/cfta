import { detectRapidPeeling, detectExchangeDeposit, evaluateNode } from "../src/lib/heuristics.js";
import type { GraphEdge, GraphNode } from "../src/types/trace.js";

function mockEdge(id: string, source: string, target: string, timestamp: number): GraphEdge {
  return { id, source, target, amount: 100, tokenSymbol: "USDT", timestamp };
}

function testRapidPeelingFires() {
  const now = Date.now();
  // 6 outgoing edges from SCAMMER, all within 3 minutes
  const edges: GraphEdge[] = Array.from({ length: 6 }, (_, i) =>
    mockEdge(`tx${i}`, "SCAMMER", `MULE_${i}`, now + i * 30_000) // 30s apart
  );

  const flag = detectRapidPeeling("SCAMMER", edges);

  return [
    ["rapid peeling flag fires with 6 edges in ~3 minutes", flag !== null],
    ["reason mentions the correct count", flag?.reason.includes("6 outbound transfers") ?? false],
  ] as const;
}

function testRapidPeelingDoesNotFireBelowThreshold() {
  const now = Date.now();
  // only 3 outgoing edges — below the minimum of 5
  const edges: GraphEdge[] = Array.from({ length: 3 }, (_, i) =>
    mockEdge(`tx${i}`, "NORMAL_WALLET", `OTHER_${i}`, now + i * 10_000)
  );

  const flag = detectRapidPeeling("NORMAL_WALLET", edges);
  return [["does not fire with only 3 outgoing edges", flag === null]] as const;
}

function testRapidPeelingDoesNotFireWhenSpreadOut() {
  const now = Date.now();
  // 6 edges, but spread across 2 hours — not "rapid"
  const edges: GraphEdge[] = Array.from({ length: 6 }, (_, i) =>
    mockEdge(`tx${i}`, "SLOW_WALLET", `OTHER_${i}`, now + i * 20 * 60_000) // 20 min apart
  );

  const flag = detectRapidPeeling("SLOW_WALLET", edges);
  return [["does not fire when spread over 2 hours", flag === null]] as const;
}

function testExchangeDepositFlag() {
  const exchangeNode: GraphNode = {
    id: "HOT_WALLET",
    depth: 2,
    isStartNode: false,
    isExchange: true,
    exchangeName: "Demo Exchange",
    riskFlags: [],
  };
  const normalNode: GraphNode = {
    id: "NORMAL",
    depth: 1,
    isStartNode: false,
    isExchange: false,
    riskFlags: [],
  };

  const exchangeFlag = detectExchangeDeposit(exchangeNode);
  const normalFlag = detectExchangeDeposit(normalNode);

  return [
    ["fires for an exchange-tagged node", exchangeFlag !== null],
    ["reason includes the exchange name", exchangeFlag?.reason.includes("Demo Exchange") ?? false],
    ["does not fire for a non-exchange node", normalFlag === null],
  ] as const;
}

function testEvaluateNodeCombinesFlags() {
  const now = Date.now();
  const node: GraphNode = {
    id: "BUSY_EXCHANGE",
    depth: 1,
    isStartNode: false,
    isExchange: true,
    exchangeName: "Demo Exchange",
    riskFlags: [],
  };
  // this node ALSO has rapid outgoing activity (before it was tagged exchange, hypothetically)
  const edges: GraphEdge[] = Array.from({ length: 5 }, (_, i) =>
    mockEdge(`tx${i}`, "BUSY_EXCHANGE", `OUT_${i}`, now + i * 10_000)
  );

  const flags = evaluateNode(node, edges);

  return [
    ["both heuristics can fire on the same node", flags.length === 2],
    ["includes rapid-peeling type", flags.some((f) => f.type === "rapid-peeling")],
    ["includes exchange-deposit type", flags.some((f) => f.type === "exchange-deposit")],
  ] as const;
}

const results = [
  ...testRapidPeelingFires(),
  ...testRapidPeelingDoesNotFireBelowThreshold(),
  ...testRapidPeelingDoesNotFireWhenSpreadOut(),
  ...testExchangeDepositFlag(),
  ...testEvaluateNodeCombinesFlags(),
];

let allPassed = true;
for (const [label, passed] of results) {
  console.log(passed ? `✅ ${label}` : `❌ ${label}`);
  if (!passed) allPassed = false;
}
process.exit(allPassed ? 0 : 1);