import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ReadonlyURLSearchParams } from "next/navigation";
import { Coin } from "@/lib/use-wallet-store";

export const getReferral = (searchParms: ReadonlyURLSearchParams) => {
  const r = searchParms.get("r");
  if (r) {
    return r;
  } else {
    return "";
  }
};

export const getCoinLabel = (net: Coin) => {
  switch (net) {
    case "ETH":
      return "ETHEREUM";
    case "SOL":
      return "SOLANA";
    case "BNB":
      return "BNB";
    case "USDT":
      return "USDT";
  }
};

export function shortenAddress(
    address: string,
    startLength: number = 6,
    endLength: number = 4,
) {
  if (!address || address.length < startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}