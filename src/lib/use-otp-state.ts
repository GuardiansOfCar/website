import { useWalletStore } from "@/lib/use-wallet-store";
import { useEffect } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useOtpStore } from "@/lib/use-otp-store";
import useSWR from "swr";

export function useOtpState() {
  const walletStore = useWalletStore();
  const { state, setState } = useOtpStore();

  const fetchOtp = () => {
    fetch(
      `${API_BASE_URL}/v1/wallets/info?icoWalletAddress=${walletStore.address}&icoNetwork=${walletStore.network}`,
    )
      .then((r) => r.json())
      .then((result) => {
        const data = result as {
          isRegisteredOtp: boolean;
        };
        setState(data.isRegisteredOtp ? "registered" : "unregistered");
      });
  };

  useEffect(() => {
    const i = setInterval(() => {
      if (
        walletStore.info?.walletId &&
        walletStore.info?.icoAddress &&
        walletStore.info?.icoNetwork &&
        state !== "registered"
      ) {
        fetchOtp();
      }
    }, 5000);

    if (
      walletStore.info?.walletId &&
      walletStore.info?.icoAddress &&
      walletStore.info?.icoNetwork &&
      state !== "registered"
    ) {
      fetchOtp();
    }

    return () => {
      clearInterval(i);
    };
  }, [walletStore.info?.walletId]);

  return state;
}
