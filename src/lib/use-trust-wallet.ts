"use client";

import { useWallet } from "@/lib/use-wallet";
import { useSolanaTx } from "@/lib/use-solana-tx";
import { useEvmTx } from "@/lib/use-evm-tx";
import { useSyncProviders } from "@/lib/use-ethereum-store";
import { useMemo } from "react";
import { trackWalletConnect } from "@/lib/utils";

export function useTrustWallet() {
  const wallet = useWallet();

  const providers = useSyncProviders();
  const provider = useMemo(
    () => providers.find((x) => x.info.name === "Trust Wallet")?.provider,
    [providers],
  );
  const evmTx = useEvmTx(provider);

  const handleConnect = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return alert(
        "Trust Wallet does not support direct connection from mobile devices. Please connect via Wallet Connect.",
      );
    }

    if (provider === undefined) {
      return alert("Trust Wallet is not installed.");
    }

    let address: string = "";
    if (wallet.network === "SOL") {
      const resp = await provider.solana.connect();
      address = resp.publicKey.toString();
    } else {
      await evmTx.switchNetwork(wallet.network);
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      address = accounts[0];
    }

    wallet.set(address, "trustwallet");
    
    // Track wallet connection for Google Analytics
    trackWalletConnect();
  };

  const solanaTx = useSolanaTx(provider?.solana);

  const generateTx = async (amount: number) => {
    return wallet.network === "SOL"
      ? await solanaTx.generateSignedTransaction(amount)
      : await evmTx.generateSignedTransaction(amount);
  };

  return {
    generateTx,
    connect: handleConnect,
  };
}
