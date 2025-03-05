"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/button";
import { useWallet } from "@/lib/use-wallet";
import { WalletManagePopup } from "@/components/wallet-manage-popup";
import { shortenAddress } from "@/lib/utils";
import {API_BASE_URL, wrapWindow} from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";

interface Stats {
  icoEthAmount: number;
  icoSolAmount: number;
  icoBnbAmount: number;
  icoUSDTAmount: number;
  totalGocarAmount: number;
  doneGocarAmount: number;
  notGocarAmount: number;
}

export const ReferralHistory = () => {
  const t = useTranslations();
  const wallet = useWallet();
  const [data, setData] = useState<Stats>({
    icoBnbAmount: 0,
    icoEthAmount: 0,
    icoSolAmount: 0,
    doneGocarAmount: 0,
    icoUSDTAmount: 0,
    notGocarAmount: 0,
    totalGocarAmount: 0,
  });

  const walletManageRef = useRef<any>(null);

  const handleCreateReferral = () => {
    if (!wallet.address) return alert("Please connect your wallet first.");
    if (!wallet.id)
      return alert(
        "You don't have wallet Id. Participate in ICO and get your walletId first.",
      );

    fetch(`${API_BASE_URL}/v1/referrals/generate/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userWalletId: wallet.id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        wallet.sync();
      })
      .catch((e) => {
        alert("Failed to create referral code.");
      });
  };

  const referralLink = useMemo(
    () =>
      `${wrapWindow?.location.protocol}://${wrapWindow?.location.host}?r=${wallet.referral}`,
    [wallet.referral],
  );
  const handleCopyReferral = () => {
    wrapWindow?.navigator.clipboard.writeText(referralLink);
    alert("Copied referral link.");
  };

  useEffect(() => {
    if (!wallet.id) return;
    fetch(`${API_BASE_URL}/v1/referrals/status/my/${wallet.id}`).then(
      async (res) => {
        if (res.status === 200 || res.status == 201) {
          const data = (await res.json()) as Stats;
          setData(data);
        }
      },
    );
  }, [wallet.id]);

  const router = useRouter();

  return (
    <>
      <div
        className={
          "bg-neutral-100 p-9 border-neutral-0 border-4 flex flex-col space-y-6 self-stretch"
        }
      >
        <p className={"text-neutral-0 text-header-3"}>{t("referral.a1")}</p>

        <table>
          <thead>
            <tr
              className={clsx(
                "[&>th]:text-left [&>th]:px-4  [&>th]:py-3 [&>th]:border-b [&>th]:border-b-neutral-60 [&>th]:text-title-1b [&>th]:text-neutral-30",
              )}
            >
              <th>SOL</th>
              <th>ETH</th>
              <th className={"w-[60%]"}>BNB</th>
            </tr>
          </thead>
          <tbody>
            <tr
              className={clsx(
                "[&>td]:text-left [&>td]:px-4  [&>td]:py-3 [&>td]:border-b [&>td]:border-b-neutral-60 [&>td]:text-header-4 [&>th]:text-neutral-0",
              )}
            >
              <td>{data.icoSolAmount}</td>
              <td>{data.icoEthAmount}</td>
              <td>{data.icoBnbAmount}</td>
            </tr>
          </tbody>
        </table>

        <div className={"flex w-full space-x-8"}>
          {wallet.referral ? (
            <div
              onClick={handleCopyReferral}
              className={
                "bg-[#F0F0F0] text-title-1 px-4 py-[18px] flex-1 text-[#646464] cursor-pointer flex justify-between items-center"
              }
            >
              <span>{referralLink}</span>
              <Image
                src={"/images/copy.png"}
                alt={"cpoy"}
                width={24}
                height={24}
              />
            </div>
          ) : (
            <div
              onClick={handleCreateReferral}
              className={
                "bg-[#CDE7E5] text-title-1 px-4 py-[18px] flex-1 text-[#646464] cursor-pointer"
              }
            >
              {t("referral.a2")}
            </div>
          )}
          <Button
            onClick={() => {
              alert(
                "Please select a network and wallet from the main screen and connect them.",
              );
              router.push("/");
            }}
            disabled={!!wallet.address}
            className={"w-[240px]"}
          >
            {wallet.address ? shortenAddress(wallet.address) : t("referral.a3")}
          </Button>
        </div>
      </div>

      <WalletManagePopup ref={walletManageRef} />
    </>
  );
};
