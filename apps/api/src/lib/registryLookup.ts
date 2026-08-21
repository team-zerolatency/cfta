import { prisma } from "@cfta/database";
import type { CheckCrossCaseWallet } from "../types/trace.js";

export const checkCrossCaseWallet: CheckCrossCaseWallet = async (address) => {
  const wallet = await prisma.wallet.findUnique({
    where: { address },
    select: { firNumbers: true },
  });

  return { firNumbers: wallet?.firNumbers ?? [] };
};