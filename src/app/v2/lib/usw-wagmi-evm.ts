"use client";

import { useWallet } from "@/app/v2/lib/use-wallet";
import { useSendTransaction } from "wagmi";
import {
  BNB_USDT_CONTRACT,
  BSC_ADDRESS,
  ETH_ADDRESS,
  ETH_USDT_CONTRACT,
} from "@/app/v2/lib/constants";
import { parseEther } from "ethers";
import { trackPurchase } from "@/app/v2/lib/utils";

export function useWagmiEvm() {
  const wallet = useWallet();

  const { sendTransactionAsync } = useSendTransaction();

  const generateTx = async (eth: number): Promise<string> => {
    const value =
      wallet.coin === "USDT" ? parseEther("0") : parseEther(String(eth));
    const receipt = wallet.network === "BNB" ? BSC_ADDRESS : ETH_ADDRESS;

    const to =
      wallet.coin === "USDT"
        ? wallet.network === "BNB"
          ? BNB_USDT_CONTRACT
          : ETH_USDT_CONTRACT
        : receipt;

    const usdtDemical = wallet.network === "BNB" ? 18 : 6;

    const result = await sendTransactionAsync({
      to,
      value: value,
      gas: BigInt("300000"),
      data:
        wallet.coin === "USDT"
          ? `0x${"a9059cbb"}${receipt.replace("0x", "").padStart(64, "0")}${(eth * 10 ** usdtDemical).toString(16).padStart(64, "0")}`
          : `0x`,
    });

    // Track purchase for Google Analytics with automatic USD conversion
    // Uses the actual coin type and amount for accurate USD calculation
    const coinType = wallet.coin === "USDT" ? "USDT" : (wallet.network === "BNB" ? "BNB" : "ETH");
    await trackPurchase(result, eth, coinType);

    return result as string;
  };

  return {
    generateTx,
  };
}
