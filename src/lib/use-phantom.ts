"use client";

import { useWallet } from "@/lib/use-wallet";
import { useSolanaTx } from "@/lib/use-solana-tx";
import { useEvmTx } from "@/lib/use-evm-tx";
import { wrapWindow } from "@/lib/constants";

export function usePhantom() {
  const wallet = useWallet();

  const provider = wrapWindow?.phantom;

  const handleConnect = async () => {
    if (provider === undefined) {
      return alert("Phantom is not installed.");
    }

    let address: string = "";
    if (wallet.network === "SOL") {
      const resp = await provider.solana.connect();
      address = resp.publicKey.toString();
    }

    if (wallet.network === "ETH") {
      address = (
        await provider.ethereum.request({
          method: "eth_requestAccounts",
        })
      )[0];
    }

    wallet.set(address, "phantom");
  };

  const solanaTx = useSolanaTx(provider?.solana);
  const evmTx = useEvmTx(provider?.ethereum);

  const generateTx = async (amount: number) => {
    return wallet.network === "SOL"
      ? await solanaTx.generateSignedTransaction(wallet.address, amount)
      : await evmTx.generateSignedTransaction(
          wallet.network,
          wallet.address,
          amount,
        );
  };

  return {
    connect: handleConnect,
    generateTx,
  };
}
