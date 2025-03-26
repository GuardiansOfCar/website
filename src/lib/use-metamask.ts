"use client";

import { useCallback, useEffect } from "react";
import { useWallet } from "@/lib/use-wallet";
import { useEvmTx } from "@/lib/use-evm-tx";

import { MetaMaskSDK } from "@metamask/sdk";

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "GUARDIANS OF THE CAR",
    url: "https://guardiansofthecar.com",
  },
});

export function useMetaMask() {
  const wallet = useWallet();
  const provider = MMSDK.getProvider();
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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return window.open(
        "https://metamask.app.link/dapp/guardiansofthecar.com",
      );
      return alert(
        "If you are using a mobile device, please access it through the metamask app.",
      );
    }

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
