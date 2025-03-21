"use client";

import { ReactNode, useEffect, useState } from "react";
import { API_BASE_URL, WALLET_CONNECT_PROJECT_ID } from "@/lib/constants";
import { Popup } from "@/components/popup";
import { Button } from "@/components/button";
import clsx from "clsx";
import { useOtpState } from "@/lib/use-otp-state";
import { useForm } from "react-hook-form";
import { useWallet } from "@/lib/use-wallet";
import { useOtpStore } from "@/lib/use-otp-store";
import { solana, mainnet, bsc } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { useWalletStore } from "@/lib/use-wallet-store";
import useSWR from "swr";
import { useTranslations } from "next-intl";

const metadata = {
  name: "Guardians of the car",
  description: "",
  url: "https://guardiansofthecar.com",
  icons: [""],
};

// 4. Create a AppKit instance
export const appKit = createAppKit({
  adapters: [
    new EthersAdapter(),
    new SolanaAdapter({
      wallets: [new PhantomWalletAdapter(), new TrustWalletAdapter()],
    }),
  ],
  networks: [mainnet, solana, bsc],
  metadata,
  projectId: WALLET_CONNECT_PROJECT_ID,
});

export default function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Updater />
      <OtpPopup />
    </>
  );
}

export const Updater = () => {
  const walletStore = useWalletStore();

  useSWR(
    walletStore.address && walletStore.network
      ? ["walletsInfo", walletStore.address]
      : null,
    () =>
      fetch(
        `${API_BASE_URL}/v1/wallets/info?icoWalletAddress=${walletStore.address}&icoNetwork=${walletStore.network}`,
      ).then((r) => r.json()),
    {
      onSuccess: (data) => {
        walletStore.setInfo(data);
      },
    },
  );

  return null;
};

export const OtpPopup = () => {
  const [open, setOpen] = useState(false);

  const wallet = useWallet();

  const handleOtpPopupClose = () => {
    if (state === "unregistered") return alert("Please register your OTP.");
    setOpen(false);
  };

  const { setState } = useOtpStore();
  const state = useOtpState();
  useEffect(() => {
    setOpen(state === "unregistered");
  }, [state]);

  const form = useForm<{
    code: string;
  }>({ defaultValues: { code: "" } });

  const onSubmit = async (data: { code: string }) => {
    if (!data.code)
      return alert("Please enter your valid OTP code with 6 digits.");

    const res = await fetch(`${API_BASE_URL}/v1/wallets/update`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        icoWalletAddress: wallet.icoAddress,
        otpCode: data.code,
      }),
    });

    if (res.status !== 200) {
      return alert("Failed to update OTP");
    }

    setState("registered");
  };

  const t = useTranslations();
  const code = form.watch("code");
  if (!open) return null;

  return (
    <Popup onClose={handleOtpPopupClose} title={t("otp.t4")}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={"flex flex-col space-y-3"}>
          <p className={"text-center"}>{t("otp.t1")}</p>

          <input
            {...form.register("code")}
            type={"number"}
            maxLength={6}
            className={"py-3 px-2 bg-[#CDE7E5] text-body-2 rounded-none"}
          />

          <Button disabled={!code} className={clsx("disabled:bg-neutral-30")}>
            {t("common.submit")}
          </Button>

          <Button
            onClick={handleOtpPopupClose}
            className={"!bg-neutral-40"}
            type={"button"}
          >
            {t("common.cancel")}
          </Button>

          <div
            className={"flex flex-col items-center text-body-3  space-y-1 py-4"}
          >
            <p>{t("otp.t2")}</p>
            <p>{t("otp.t3")}</p>
          </div>
        </div>
      </form>
    </Popup>
  );
};
