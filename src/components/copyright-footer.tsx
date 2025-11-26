"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export const CopyrightFooter = () => {
  const t = useTranslations();

  return (
    <div
      className={
        "flex flex-col w-full max-w-[1312px] mx-auto px-6 md:px-6 py-12 md:py-[48px] rounded-2xl max-desktop:mb-0"
      }
      style={{
        borderBottomWidth: "1px",
        gap: "12px",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(7, 20, 25, 1)",
        marginBottom: "36px",
      }}
    >
      {/* 저작권 텍스트와 소셜 아이콘 */}
      <div
        className={
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0"
        }
      >
        <p className={"text-neutral-100 text-sm md:text-base font-medium"}>
          {t("home.footer.copyright")}
        </p>
        <div className={"flex items-center gap-4"}>
          <a
            className={
              "cursor-pointer w-6 h-6 relative flex items-center justify-center"
            }
            target={"_blank"}
            rel={"noopener noreferrer"}
            href={"https://app.binance.com/uni-qr/cpro/GOTCAR"}
            aria-label={"Visit GOTCAR on Binance"}
          >
            <Image
              src={"/images/binance-square-icon.png"}
              width={24}
              height={24}
              alt={"Visit GOTCAR on Binance"}
              title={"GOTCAR on Binance"}
              loading={"lazy"}
            />
          </a>
          <a
            className={
              "cursor-pointer w-6 h-6 relative flex items-center justify-center"
            }
            target={"_blank"}
            rel={"noopener noreferrer"}
            href={"https://x.com/gotcar_official"}
            aria-label={"Follow GOTCAR on X (Twitter)"}
          >
            <Image
              src={"/images/x-icon.png"}
              width={24}
              height={24}
              alt={"Follow GOTCAR on X (Twitter)"}
              title={"GOTCAR Official X (Twitter) Account"}
              loading={"lazy"}
            />
          </a>
          <a
            className={
              "cursor-pointer w-6 h-6 relative flex items-center justify-center"
            }
            target={"_blank"}
            rel={"noopener noreferrer"}
            href={"https://t.me/Gotcar_Official"}
            aria-label={"Join GOTCAR Telegram Community"}
          >
            <Image
              src={"/images/telegram-icon.png"}
              width={24}
              height={24}
              alt={"Join GOTCAR Telegram Community"}
              title={"GOTCAR Official Telegram Channel"}
              loading={"lazy"}
            />
          </a>
        </div>
      </div>
      <p
        className={"text-neutral-100 text-xs md:text-sm leading-5 md:leading-6"}
      >
        {t("home.footer.disclaimer1")}
        <br />
        {t("home.footer.disclaimer2")}
      </p>
    </div>
  );
};
