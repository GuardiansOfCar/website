"use client";

import { Button } from "@/app/v2/components/button";
import { useTranslations } from "next-intl";
import { useWallet } from "@/app/v2/lib/use-wallet";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";

export const ActionPopup = ({
  onSubmit,
}: {
  onSubmit: (a: string) => void;
}) => {
  const t = useTranslations();
  const wallet = useWallet();

  const [value, setValue] = useState("");

  const handleClick = () => {
    let solanaAddress: string = "";
    try {
      solanaAddress = new PublicKey(value).toString();
    } catch (e) {
      alert(t("submit.t7"));
      return;
    }
    onSubmit(solanaAddress);
  };

  return (
    <div
      className={
        "bg-neutral-100 border-neutral-0 border-4 w-full max-w-[828px] m-auto  pb-9 px-9 max-laptop:px-5 max-laptop:pb-5"
      }
    >
      <div className={"py-8 max-laptop:py-6 flex items-center justify-center "}>
        <span className={"text-header-3"}>{t("submit.t1")}</span>
      </div>
      <div className={"flex w-full gap-8 max-laptop:flex-col max-laptop:gap-6"}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!wallet.address}
          placeholder={wallet.address ? t("submit.t7") : t("submit.t2")}
          className={
            "bg-[#CDE7E5] text-title-1 px-4 py-[18px] flex-1 placeholder:text-[#646464] disabled:bg-[#F0F0F0]"
          }
        />
        <Button
          disabled={!wallet.address}
          className={"min-w-[240px]"}
          onClick={handleClick}
        >
          {t("submit.t3")}
        </Button>
      </div>

      <div className={"text-body-3 text-[#646464] mt-8"}>
        {t("submit.t4")}
        <br />
        {t("submit.t5")}
        <br />
        {t("submit.t6")}
      </div>
    </div>
  );
};
