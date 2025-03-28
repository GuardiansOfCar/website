"use client";

import { useEffect, useMemo } from "react";
import { useWallet } from "@/lib/use-wallet";
import {
  useAccount,
  useChainId,
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

  const { isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { switchChain } = useSwitchChain();
  const { disconnectAsync } = useDisconnect();
  const chainId = useChainId();
  const connector = useMemo(
    () => connectors.find((x) => x.id === "metaMaskSDK"),
    [connectors],
  );

  useEffect(() => {
    if (wallet.address && wallet.network === "BNB" && chainId !== 56) {
      switchChain({
        chainId: 56,
      });
    } else if (wallet.address && wallet.network === "ETH" && chainId !== 1) {
      switchChain({
        chainId: 1,
      });
    }
  }, [wallet.network, wallet.address, chainId]);

  const wagmiConnect = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    if (!connector) return alert("We can`t find metamask connector.");

    const { accounts } = await connectAsync({ connector });
    wallet.set(accounts[0], "metamask");
  };

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
