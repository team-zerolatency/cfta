import { buildTraceApiUrl } from "../lib/api";

const checks: Array<[string, boolean]> = [
  [
    "builds correct URL with trailing slash on base",
    buildTraceApiUrl("http://localhost:4000/", "TXabc123", 4) ===
      "http://localhost:4000/trace/TXabc123?depth=4",
  ],
  [
    "builds correct URL without trailing slash on base",
    buildTraceApiUrl("http://localhost:4000", "TXabc123", 4) ===
      "http://localhost:4000/trace/TXabc123?depth=4",
  ],
  [
    "URL-encodes special characters in the address",
    buildTraceApiUrl("http://localhost:4000", "TX abc/123", 2).includes("TX%20abc%2F123"),
  ],
];

let allPassed = true;
for (const [label, passed] of checks) {
  console.log(passed ? `✅ ${label}` : `❌ ${label}`);
  if (!passed) allPassed = false;
}
process.exit(allPassed ? 0 : 1);