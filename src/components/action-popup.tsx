"use client";

import { useClickAway, useLockBodyScroll } from "@uidotdev/usehooks";
import { Button } from "@/components/button";
import { useTranslations } from "next-intl";
import { useWallet } from "@/lib/use-wallet";

export const ActionPopup = ({ onClose }: { onClose: () => void }) => {
  const ref = useClickAway<HTMLDivElement>(() => {
    onClose();
  });

  const t = useTranslations();
  useLockBodyScroll();
  const wallet = useWallet();

  return (
    <div
      className={
        "fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-[#0000007A]"
      }
    >
      <div
        className={
          "bg-neutral-100 border-neutral-0 border-4 w-full max-w-[828px] mx-5 pb-9 px-9 max-laptop:px-5 max-laptop:pb-5"
        }
        ref={ref}
      >
        <div
          className={"py-8 max-laptop:py-6 flex items-center justify-center "}
        >
          <span className={"text-header-3"}>{t("submit.t1")}</span>
        </div>
        <div
          className={"flex w-full gap-8 max-laptop:flex-col max-laptop:gap-6"}
        >
          <input
            disabled={!wallet.address}
            placeholder={wallet.address ? t("submit.t7") : t("submit.t2")}
            className={
              "bg-[#CDE7E5] text-title-1 px-4 py-[18px] flex-1 placeholder:text-[#646464] disabled:bg-[#F0F0F0]"
            }
          />
          <Button
            disabled={!wallet.address}
            className={"min-w-[240px]"}
            onClick={onClose}
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
    </div>
  );
};
