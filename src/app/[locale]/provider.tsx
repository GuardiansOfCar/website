"use client";

import { ReactNode, useEffect, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_BASE_URL, WALLET_CONNECT_PROJECT_ID } from "@/lib/constants";
import { Popup } from "@/components/popup";
import { Button } from "@/components/button";
import clsx from "clsx";
import { useWallet } from "@/lib/use-wallet";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLET_CONNECT_PROJECT_ID }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

export default function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
        <OtpPopup />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const OtpPopup = () => {
  const wallet = useWallet();
  const [open, setOpen] = useState(false);
  const handleOtpPopupClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!wallet.icoAddress) return;

    const tm = setInterval(() => {
      fetch(
        `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}`,
      ).then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          console.log(await res.json());
        }
      });
    }, 5000);

    return () => {
      clearInterval(tm);
    };
  }, [wallet.icoAddress]);

  if (!open) return null;
  return (
    <Popup onClose={handleOtpPopupClose} title={"OTP Authentication"}>
      <div className={"flex flex-col space-y-3"}>
        <p className={"text-center"}>Enter the code to verify your identity</p>

        <input className={"py-3 px-2 bg-[#CDE7E5] text-body-2 rounded-none"} />

        <Button
          onClick={handleOtpPopupClose}
          disabled
          className={clsx("disabled:bg-neutral-30")}
        >
          CONTINUE
        </Button>

        <Button onClick={handleOtpPopupClose} className={"!bg-neutral-40"}>
          CANCEL
        </Button>
      </div>
    </Popup>
  );
};
