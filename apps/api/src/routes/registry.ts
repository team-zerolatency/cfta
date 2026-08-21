import { Router } from "express";
import { prisma } from "@cfta/database";

export const registryRouter: Router = Router();

registryRouter.post("/flag", async (req, res) => {
  const { address, firNumber, flaggedBy, reason, tags } = req.body ?? {};

  if (!address || typeof address !== "string" || address.length < 30) {
    return res.status(400).json({ error: "A valid wallet address is required" });
  }
  if (!firNumber || typeof firNumber !== "string") {
    return res.status(400).json({ error: "An FIR number is required to flag a wallet" });
  }

  try {
    const existing = await prisma.wallet.findUnique({ where: { address } });

    const nextFirNumbers = Array.from(new Set([...(existing?.firNumbers ?? []), firNumber]));
    const nextTags = Array.from(
      new Set([...(existing?.tags ?? []), ...(Array.isArray(tags) ? tags : [])])
    );

    const wallet = await prisma.wallet.upsert({
      where: { address },
      update: { firNumbers: nextFirNumbers, tags: nextTags },
      create: { address, firNumbers: [firNumber], tags: nextTags },
    });

    await prisma.flagEvent.create({
      data: {
        walletId: wallet.id,
        reason: reason || `Manually flagged under FIR ${firNumber}`,
        source: "manual",
        firNumber,
        flaggedBy,
      },
    });

    res.status(201).json({ wallet });
  } catch (err) {
    console.error("Failed to flag wallet:", err);
    res.status(500).json({ error: "Failed to write to the risk registry" });
  }
});

registryRouter.get("/:address", async (req, res) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address: req.params.address },
      include: { flagEvents: true },
    });

    if (!wallet) {
      return res.json({ flagged: false });
    }

    res.json({ flagged: true, wallet });
  } catch (err) {
    console.error("Failed to read registry:", err);
    res.status(500).json({ error: "Failed to read the risk registry" });
  }
});