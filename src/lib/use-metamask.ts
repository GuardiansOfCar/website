"use client";

import { useCallback, useEffect } from "react";
import { useWallet } from "@/lib/use-wallet";
import { useEvmTx } from "@/lib/use-evm-tx";
import { wrapWindow } from "@/lib/constants";

export function useMetaMask() {
  const wallet = useWallet();

  const provider = wrapWindow?.ethereum?.providers?.find(
    (x: any) => x.isMetaMask && !x.isTrustWallet,
  );

  useEffect(() => {
    if (wallet.provider !== "metamask") return;

    function handleAccountsChanged(accounts: string[]) {
      wallet.set(accounts[0], "metamask");
    }

    provider.on("accountsChanged", handleAccountsChanged);

    return () => {
      provider.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [wallet.provider]);

  const handleConnect = useCallback(async () => {
    if (provider === undefined) {
      return alert("Metamask not installed.");
    }

    console.log(provider);
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });

    wallet.set(accounts[0], "metamask");
  }, []);

  const evmTx = useEvmTx(provider);

  const generateTx = async (eth: number) => {
    return await evmTx.generateSignedTransaction(
      wallet.network,
      wallet.address,
      eth,
    );
  };

  return {
    generateTx,
    connect: handleConnect,
  };
}
