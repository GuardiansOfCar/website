import { useEffect, useMemo, useRef } from "react";
import { useWallet } from "@/lib/use-wallet";
import { useConnect, useAccount, useDisconnect } from "wagmi";

export function useWalletConnect() {
  const { connectors, connect } = useConnect();
  const connector = useMemo(
    () => connectors.find((x) => x.id === "walletConnect"),
    [connectors],
  );
  const { address } = useAccount();
  const wallet = useWallet();
  const connectRequestState = useRef(false);

  useEffect(() => {
    if (address) {
      if (connectRequestState.current) {
        wallet.set(address, "walletconnect");
        connectRequestState.current = false;
      }
    }
  }, [address]);

  const handleConnect = async () => {
    if (!connector) return alert("You don't use Wallet Connect.");
    connectRequestState.current = true;
    connect({ connector });
  };

  return {
    connect: handleConnect,
  };
}
