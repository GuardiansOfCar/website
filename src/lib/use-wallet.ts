import { Network, Provider, useWalletStore } from "@/lib/use-wallet-store";
import { useDisconnect } from "@reown/appkit/react";

export function useWallet() {
  const walletStore = useWalletStore();

  const { disconnect } = useDisconnect();

  return {
    set: (address: string, provider: Provider) => {
      if (!address) return alert("You don't have wallet to set.");
      walletStore.setAddress(address);
      walletStore.setProvider(provider);
    },
    address: walletStore.address,
    id: walletStore.info?.walletId,
    provider: walletStore.provider,
    referral: walletStore.info?.referralCode,
    icoAddress: walletStore.info?.icoAddress,
    network: walletStore.network,
    coin: walletStore.coin,
    setCoin: walletStore.setCoin,
    setNetwork: async (net: Network) => {
      if (walletStore.provider === "walletconnect") {
        await disconnect();
      }
      walletStore.clear();
      walletStore.setNetwork(net);
    },
    disconnect: async () => {
      if (walletStore.provider === "walletconnect") {
        await disconnect();
      }
      walletStore.clear();
    },
  };
}
