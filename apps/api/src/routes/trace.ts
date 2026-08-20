import { Router } from "express";
import { getOutgoingTrc20Transfers } from "../lib/tron.js";
import { traceWallet } from "../lib/tracer.js";
import { checkExchangeWallet } from "../lib/exchangeRegistry.js";
import { evaluateNode } from "../lib/heuristics.js";

export const traceRouter: Router = Router();

traceRouter.get("/:address", async (req, res) => {
  const { address } = req.params;

  const MAX_REQUESTABLE_DEPTH = 8;
  const requestedDepth = req.query.depth ? Number(req.query.depth) : undefined;
  const depth =
    requestedDepth !== undefined
      ? Math.min(Math.max(requestedDepth, 1), MAX_REQUESTABLE_DEPTH)
      : undefined;

  if (!address || address.length < 30) {
    return res.status(400).json({ error: "Invalid Tron address" });
  }

  try {
    const result = await traceWallet(address, getOutgoingTrc20Transfers, checkExchangeWallet, {
      maxDepth: depth,
    });

    for (const node of result.nodes) {
      node.riskFlags = evaluateNode(node, result.edges);
    }

    res.json(result);
  } catch (err) {
    console.error("Trace failed:", err);
    res.status(502).json({ error: "Failed to trace wallet — TronGrid may be unavailable" });
  }
});