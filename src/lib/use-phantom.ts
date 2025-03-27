"use client";

import { useWallet } from "@/lib/use-wallet";
import { useSolanaTx } from "@/lib/use-solana-tx";
import { useEvmTx } from "@/lib/use-evm-tx";
import { wrapWindow } from "@/lib/constants";
import { useWalletStore } from "@/lib/use-wallet-store";
import { useEffect } from "react";

export function usePhantom() {
  const wallet = useWallet();

  const provider = wrapWindow?.phantom;

  const evmTx = useEvmTx(provider?.ethereum);

  const handleConnect = async () => {
    if (provider === undefined) {
      return alert("Phantom is not installed.");
    }

    let address: string = "";
    let pb: any;
    if (wallet.network === "SOL") {
      const resp = await provider.solana.connect();
      address = resp.publicKey.toString();
      pb = provider.solana;
    }

    if (wallet.network === "ETH") {
      await evmTx.switchNetwork(wallet.network);
      address = (
        await provider.ethereum.request({
          method: "eth_requestAccounts",
        })
      )[0];
      pb = provider.ethereum;
    }

    wallet.set(address, "phantom");
  };

  const solanaTx = useSolanaTx(provider?.solana);

  const generateTx = async (amount: number) => {
    return wallet.network === "SOL"
      ? await solanaTx.generateSignedTransaction(amount)
      : await evmTx.generateSignedTransaction(amount);
  };

  return {
    connect: handleConnect,
    generateTx,
  };
}
