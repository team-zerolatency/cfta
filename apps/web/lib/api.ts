export function buildTraceApiUrl(baseUrl: string, address: string, depth: number): string {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  return `${trimmedBase}/trace/${encodeURIComponent(address)}?depth=${depth}`;
}