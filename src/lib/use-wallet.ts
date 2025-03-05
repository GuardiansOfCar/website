import { Provider, useWalletStore } from "@/lib/use-wallet-store";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

export function useWallet() {
  const walletStore = useWalletStore();
  const [id, setId] = useState<number>(0);
  const [referral, setReferral] = useState("");
  const [icoAddress, setIcoAddress] = useState("");

  const fetchId = () => {
    fetch(
      `${API_BASE_URL}/v1/wallets/info?icoWalletAddress=${walletStore.address}&icoNetwork=${walletStore.network}`,
    )
      .then((r) => r.json())
      .then((result) => {
        const data = result as {
          solanaAddress: string;
          icoAddress: string;
          icoNetwork: string;
          walletId: number;
          referralCode: string;
        };

        setId(data.walletId);
        setReferral(data.referralCode);
        setIcoAddress(data.icoAddress);
      });
  };

  useEffect(() => {
    if (!walletStore.address || !walletStore.network) return;
    const tm = setTimeout(() => {
      fetchId();
    }, 1000);

    return () => {
      clearTimeout(tm);
    };
  }, [walletStore.address]);

  return {
    set: (address: string, provider: Provider) => {
      if (!address) return alert("You don't have wallet to set.");
      walletStore.setAddress(address);
      walletStore.setProvider(provider);
    },
    address: walletStore.address,
    id,
    clear: () => {
      walletStore.clear();
    },
    provider: walletStore.provider,
    referral,
    icoAddress,
    network: walletStore.network,
    coin: walletStore.coin,
    setCoin: walletStore.setCoin,
    setNetwork: walletStore.setNetwork,
    sync: () => fetchId(),
  };
}
