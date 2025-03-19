import { useEffect } from "react";
import { useWallet } from "@/lib/use-wallet";
import {
  useAppKit,
  useAppKitProvider,
  Provider,
  useAppKitAccount,
  useAppKitNetworkCore,
  useDisconnect,
} from "@reown/appkit/react";
import type { Provider as SolProvider } from "@reown/appkit-adapter-solana/react";
import { bsc, mainnet, solana } from "@reown/appkit/networks";
import { appKit } from "@/app/[locale]/provider";
import { useSolanaTx } from "@/lib/use-solana-tx";
import { useEvmTx } from "@/lib/use-evm-tx";
import { useWalletStore } from "@/lib/use-wallet-store";

export function useWalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetworkId } = useAppKitNetworkCore();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const wallet = useWallet();
  const { walletProvider: solanaWalletProvider } =
    useAppKitProvider<SolProvider>("solana");

  useEffect(() => {
    if (address && isConnected) {
      wallet.set(
        address,
        "walletconnect",
        caipNetworkId?.startsWith("solana")
          ? "SOL"
          : wallet.network === "BNB"
            ? "BNB"
            : "ETH",
        wallet.network === "SOL" ? solanaWalletProvider : walletProvider,
      );
    }
  }, [address, isConnected, wallet.provider]);

  const handleConnect = async () => {
    if (
      (wallet.network === "SOL" &&
        address &&
        caipNetworkId &&
        !caipNetworkId?.startsWith("solana")) ||
      (wallet.network !== "SOL" &&
        address &&
        caipNetworkId &&
        !caipNetworkId?.startsWith("eip"))
    ) {
      await disconnect();
    } else {
      if (address && isConnected) return wallet.set(address, "walletconnect");
    }

    if (wallet.network === "BNB") {
      appKit.switchNetwork(bsc);
    } else if (wallet.network === "ETH") {
      appKit.switchNetwork(mainnet);
    } else {
      appKit.switchNetwork(solana);
    }

    open({
      view: "Connect",
      namespace: wallet.network === "SOL" ? "solana" : "eip155",
    });
  };

  const solanaTx = useSolanaTx(solanaWalletProvider);
  const evmTx = useEvmTx(walletProvider);

  const handleTx = async (amt: number) => {
    if (wallet.network === "SOL") {
      return await solanaTx.generateSignedTransaction(amt);
    } else {
      return await evmTx.generateSignedTransaction(amt);
    }
  };

  return {
    generateTx: handleTx,
    connect: handleConnect,
  };
}
