"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useWallet } from "@/lib/use-wallet";
import { WalletManagePopup } from "@/components/wallet-manage-popup";
import { API_BASE_URL } from "@/lib/constants";
import { ButtonRenewal } from "@/components/button-renewal";

import { useWalletConnectorStore } from "@/lib/use-wallet-connector-store";

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
  const { setConnect } = useWalletConnectorStore();
  const [data, setData] = useState<Stats>({
    icoBnbAmount: 0,
    icoEthAmount: 0,
    icoSolAmount: 0,
    doneGocarAmount: 0,
    icoUSDTAmount: 0,
    notGocarAmount: 0,
    totalGocarAmount: 0,
  });

  useEffect(() => {
    if (!wallet.id) return;
    fetch(`${API_BASE_URL}/referrals/status/my/${wallet.id}`).then(
      async (res) => {
        if (res.status === 200 || res.status == 201) {
          const data = (await res.json()) as Stats;
          setData(data);
        }
      }
    );
  }, [wallet.id]);

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
                  setConnect(true);
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

      <WalletManagePopup />
    </>
  );
};
