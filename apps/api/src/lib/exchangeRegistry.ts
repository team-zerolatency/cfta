import { prisma } from "@cfta/database";
import type { CheckExchangeWallet } from "../types/trace.js";

export const checkExchangeWallet: CheckExchangeWallet = async (address) => {
  const wallet = await prisma.wallet.findUnique({
    where: { address },
    select: { isExchange: true, exchangeName: true },
  });

  if (!wallet?.isExchange) {
    return { isExchange: false };
  }

  return { isExchange: true, exchangeName: wallet.exchangeName ?? undefined };
};