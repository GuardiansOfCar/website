"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/button";
import { useWallet } from "@/lib/use-wallet";
import { WalletManagePopup } from "@/components/wallet-manage-popup";
import { shortenAddress } from "@/lib/utils";
import { API_BASE_URL, wrapWindow } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "@/app/v2/i18n/navigation";
import { useSWRConfig } from "swr";

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

  const { mutate } = useSWRConfig();
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
        mutate(["walletsInfo"]);
      })
      .catch((e) => {
        alert("Failed to create referral code.");
      });
  };

  const referralLink = useMemo(
    () =>
      `${wrapWindow?.location.protocol}//${wrapWindow?.location.host}?r=${wallet.referral}`,
    [wallet.referral],
  );
  const handleCopyReferral = () => {
    wrapWindow?.navigator.clipboard.writeText(referralLink);
    alert("Copied your link.");
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

  const columns = [
    { label: "SOL", key: "icoSolAmount" },
    { label: "ETH", key: "icoEthAmount" },
    { label: "BNB", key: "icoBnbAmount" },
    { label: "USDT", key: "icoUSDTAmount" },
  ];

  return (
    <>
      <div
        className={
          "bg-neutral-100 p-9 border-neutral-0 border-4 flex flex-col space-y-6 self-stretch max-tablet:p-5"
        }
      >
        <p className={"text-neutral-0 text-header-3"}>{t("referral.a1")}</p>

        <div className={"max-tablet:block hidden flex flex-col space-y-6"}>
          {columns.map((c) => (
            <div key={c.key} className={"flex flex-col"}>
              <div className={"px-4 pb-3 text-title-1b text-neutral-30"}>
                {c.label}
              </div>
              <div className={"border-y border-y-[#D9D9D9] p-4"}>
                <span className={"text-neutral-0 text-header-4"}>
                  {(data as any)[c.key]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <table className={"max-tablet:hidden"}>
          <thead>
            <tr
              className={clsx(
                "[&>th]:text-left [&>th]:px-4  [&>th]:py-3 [&>th]:border-b [&>th]:border-b-neutral-60 [&>th]:text-title-1b [&>th]:text-neutral-30",
              )}
            >
              <th>SOL</th>
              <th>ETH</th>
              <th>BNB</th>
              <th>USDT</th>
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
              <td>{data.icoUSDTAmount}</td>
            </tr>
          </tbody>
        </table>

        <div
          className={"flex w-full gap-8 max-tablet:flex-col max-tablet:gap-6"}
        >
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
                "bg-[#CDE7E5] text-title-1 px-4 py-[18px] flex-1 text-neutral-0 cursor-pointer"
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
            className={"min-w-[240px]"}
          >
            {wallet.address ? shortenAddress(wallet.address) : t("referral.a3")}
          </Button>
        </div>
      </div>

      <WalletManagePopup />
    </>
  );
};
