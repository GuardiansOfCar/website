"use client";

import { useEffect, useMemo, useRef } from "react";
import { useWallet } from "@/lib/use-wallet";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { useWagmiEvm } from "@/lib/usw-wagmi-evm";
import { trackWalletConnect } from "@/lib/utils";

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

  const isConneting = useRef(false);
  const wagmiConnect = async () => {
    if (isConneting.current) return;
    isConneting.current = true;

    if (isConnected) {
      await disconnectAsync();
    }

    if (!connector) return alert("We can`t find metamask connector.");

    try {
      const { accounts } = await connectAsync({ connector });
      wallet.set(accounts[0], "metamask");
      
      // Track wallet connection for Google Analytics
      trackWalletConnect();
    } catch (error: unknown) {}
    isConneting.current = false;
  };

  const wagmiEvm = useWagmiEvm();

  return {
    generateTx: wagmiEvm.generateTx,
    connect: wagmiConnect,
  };
}
