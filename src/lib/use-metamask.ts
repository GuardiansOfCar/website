"use client";

import { useEffect, useRef } from "react";
import { useWallet } from "@/lib/use-wallet";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";
import {
  BNB_USDT_CONTRACT,
  BSC_ADDRESS,
  ETH_ADDRESS,
  ETH_USDT_CONTRACT,
} from "@/lib/constants";
import { parseEther } from "ethers";

export function useMetaMask() {
  const wallet = useWallet();

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { switchChainAsync } = useSwitchChain();

  const { disconnect } = useDisconnect();

  const connectRequested = useRef(false);
  const needUpdateAccount = useRef(false);

  useEffect(() => {
    if (isPending) {
      needUpdateAccount.current = true;
    }
  }, [isPending]);

  useEffect(() => {
    if (address && isConnected) {
      if (needUpdateAccount.current) {
        needUpdateAccount.current = false;
        wallet.set(address, "metamask");
      }
    }
  }, [address, isConnected]);

  const wagmiConnect = async () => {
    const connector = connectors.find((x) => x.id === "metaMaskSDK");
    if (!connector) {
      return alert("Metamask not installed.");
    }

    await switchChainAsync({
      chainId: wallet.network === "BNB" ? 56 : 1,
    });

    if (isConnected) {
      disconnect();
      connectRequested.current = true;
    } else {
      connect({ connector });
    }
  };

  useEffect(() => {
    if (!isConnected && connectRequested.current) {
      const connector = connectors.find((x) => x.id === "metaMaskSDK")!!;
      connectRequested.current = false;
      connect({ connector });
    }
  }, [isConnected]);

  const { sendTransactionAsync } = useSendTransaction();

  const generateTx = async (eth: number): Promise<string> => {
    if (!isConnected) throw new Error("Metamask wallet not connected.");
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
          : undefined,
    });

    return result as string;
  };

  return {
    generateTx,
    connect: wagmiConnect,
  };
}
