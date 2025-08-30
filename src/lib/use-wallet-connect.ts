import { useEffect } from "react";
import { useWallet } from "@/lib/use-wallet";
import {
  useAppKit,
  useAppKitProvider,
  useAppKitAccount,
  useDisconnect,
  useAppKitNetwork,
} from "@reown/appkit/react";
import type { Provider as SolProvider } from "@reown/appkit-adapter-solana/react";
import { useSolanaTx } from "@/lib/use-solana-tx";
import { useWagmiEvm } from "@/lib/usw-wagmi-evm";
import { trackWalletConnect } from "@/lib/utils";

let openRequested = false;

export function useWalletConnect() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const wallet = useWallet();
  const { walletProvider: solanaWalletProvider } =
    useAppKitProvider<SolProvider>("solana");

  const network = useAppKitNetwork();

  useEffect(() => {
    if (address && isConnected) {
      if (!openRequested) return;
      openRequested = false;
      wallet.set(address, "walletconnect");
      
      // Track wallet connection for Google Analytics
      trackWalletConnect();
    }
  }, [address, isConnected]);

  const handleConnect = async () => {
    if (isConnected) {
      await disconnect();
    }

    openRequested = true;

    await open({
      view: "Connect",
      namespace: wallet.network === "SOL" ? "solana" : "eip155",
    });
  };

  const solanaTx = useSolanaTx(solanaWalletProvider);

  const wagmiEvm = useWagmiEvm();

  const handleTx = async (amt: number) => {
    if (wallet.network === "SOL") {
      return await solanaTx.generateSignedTransaction(amt);
    } else {
      return await wagmiEvm.generateTx(amt);
    }
  };

  return {
    generateTx: handleTx,
    connect: handleConnect,
  };
}
