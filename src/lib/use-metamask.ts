"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "@/lib/use-wallet";
import { useEvmTx } from "@/lib/use-evm-tx";
import { useSyncProviders } from "@/lib/use-ethereum-store";
import { useWalletStore } from "@/lib/use-wallet-store";

export function useMetaMask() {
  const wallet = useWallet();
  const providers = useSyncProviders();
  const provider = useMemo(
    () => providers.find((x) => x.info.name === "MetaMask")?.provider,
    [providers],
  );
  const evmTx = useEvmTx(provider);

  useEffect(() => {
    if (wallet.provider !== "metamask") return;

    function handleAccountsChanged(accounts: string[]) {
      wallet.set(accounts[0], "metamask");
    }

    (provider as any).on("accountsChanged", handleAccountsChanged);

    return () => {
      (provider as any).removeListener(
        "accountsChanged",
        handleAccountsChanged,
      );
    };
  }, [wallet.provider]);

  const handleConnect = useCallback(async () => {
    if (provider === undefined) {
      return alert("Metamask not installed.");
    }

    await evmTx.switchNetwork(wallet.network);

    const accounts = (await provider.request({
      method: "eth_requestAccounts",
    })) as string[];

    wallet.set(accounts[0], "metamask", undefined, provider);
  }, []);

  const generateTx = async (eth: number) => {
    return await evmTx.generateSignedTransaction(eth);
  };

  return {
    generateTx,
    connect: handleConnect,
  };
}
