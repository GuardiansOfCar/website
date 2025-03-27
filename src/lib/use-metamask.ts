"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@/lib/use-wallet";
import { useEvmTx } from "@/lib/use-evm-tx";

import { MetaMaskSDK, SDKProvider } from "@metamask/sdk";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "GUARDIANS OF THE CAR",
    url: "https://guardiansofthecar.com",
  },
});

export function useMetaMask() {
  const wallet = useWallet();

  const [provider, setProvider] = useState<SDKProvider | null | undefined>(
    null,
  );

  useEffect(() => {
    const isMobile =
      typeof window !== undefined
        ? /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
        : false;
    setProvider(isMobile ? MMSDK.getMobileProvider() : MMSDK.getProvider());
  }, []);

  const evmTx = useEvmTx(provider);

  useEffect(() => {
    if (wallet.provider !== "metamask" || !provider) return;

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
  }, [wallet.provider, provider]);

  const handleConnect = async () => {
    if (provider === undefined) {
      return alert("Metamask not installed.");
    }

    await evmTx.switchNetwork(wallet.network);

    const accounts = (await provider!!.request({
      method: "eth_requestAccounts",
    })) as string[];

    wallet.set(accounts[0], "metamask", undefined, provider);
  };

  const generateTx = async (eth: number) => {
    return await evmTx.generateSignedTransaction(eth);
  };

  return {
    generateTx,
    connect: handleConnect,
  };
}
