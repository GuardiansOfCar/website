"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@/lib/use-wallet";
import { WalletManagePopup } from "@/components/wallet-manage-popup";
import { shortenAddress } from "@/lib/utils";
import { API_BASE_URL, wrapWindow } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useSWRConfig } from "swr";
import { ButtonRenewal } from "@/components/button-renewal";

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
        "You don't have wallet Id. Participate in ICO and get your walletId first."
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
    [wallet.referral]
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
      }
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
          "w-[1312px] max-w-[1312px] max-desktop:w-full max-laptop:w-full max-laptop:max-w-full"
        }
        style={{
          borderRadius: "24px",
          padding: "16px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 8px 0px #0000000A",
        }}
      >
        <section
          className={"max-laptop:w-full max-laptop:h-auto"}
          style={{
            width: "100%",
            minHeight: "256px",
            borderRadius: "16px",
            border: "1px solid #EDEEF0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px",
            backgroundColor: "#F9FBFB",
            opacity: 1,
            boxSizing: "border-box",
          }}
        >
          <div
            className={"border-b-neutral-60 border-b"}
            style={{ paddingBottom: "12px" }}
          >
            <div
              className={
                "grid grid-cols-4 max-laptop:grid-cols-2 max-mobile:grid-cols-1 gap-4"
              }
            >
              {columns.map((c) => (
                <div key={c.key} className={"flex flex-col"}>
                  <p
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: "22px",
                      color: "rgba(93, 94, 96, 1)",
                      marginBottom: "8px",
                    }}
                  >
                    {c.label}
                  </p>
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(15, 15, 15, 1)",
                    }}
                  >
                    {(data as any)[c.key].toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {!wallet.address && (
            <div
              className={"flex justify-center"}
              style={{ paddingTop: "12px" }}
            >
              <ButtonRenewal
                onClick={() => {
                  alert(
                    "Please select a network and wallet from the main screen and connect them."
                  );
                  router.push("/");
                }}
                backgroundColor={"#21EAF1"}
                borderColor={"#00D6DD"}
                className={"min-w-[240px]"}
              >
                {t("referral.a3")}
              </ButtonRenewal>
            </div>
          )}
        </section>
      </div>

      {wallet.referral && (
        <div
          className={
            "w-[1312px] max-w-[1312px] max-desktop:w-full max-laptop:w-full max-laptop:max-w-full mt-8"
          }
        >
          <div
            onClick={handleCopyReferral}
            className={
              "bg-[#F0F0F0] text-title-1 px-4 py-[18px] text-[#646464] cursor-pointer flex justify-between items-center rounded-xl"
            }
            style={{
              fontFamily: "Pretendard, sans-serif",
              fontWeight: 400,
              fontSize: "15px",
              lineHeight: "22px",
            }}
          >
            <span>{referralLink}</span>
            <Image
              src={"/images/copy.png"}
              alt={"copy"}
              width={24}
              height={24}
            />
          </div>
        </div>
      )}

      <WalletManagePopup />
    </>
  );
};
