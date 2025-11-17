"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { RoadmapContainer } from "@/app/v2/[locale]/roadmap/components/container";
import { FaqContainer } from "@/app/v2/[locale]/faq/components/container";
import { HeroSection } from "@/app/v2/[locale]/(home)/components/hero-section";
import { TechnologiesSection } from "@/app/v2/[locale]/(home)/components/technologies-section";
import { ExperienceSection } from "@/app/v2/[locale]/(home)/components/experience-section";
import { GuardianSection } from "@/app/v2/[locale]/(home)/components/guardian-section";
import { PartnershipSection } from "@/app/v2/[locale]/(home)/components/partnership-section";
import { TeamSection } from "@/app/v2/[locale]/(home)/components/team-section";

export const HomeContainer = () => {
  const t = useTranslations();

  return (
    <>
      {/* 1. HeroSection (GIF + Engineering the Next Mobility Era 통합) */}
      <HeroSection />

      {/* 1.5. Technologies Section (Engineering the Next Mobility Era) */}
      <TechnologiesSection />

      {/* 2. From Engineering to Experience 섹션 */}
      <ExperienceSection />

      {/* 3. Be the guardian 섹션 */}
      <GuardianSection />

      {/* 4. Our roadmap 섹션 */}
      <RoadmapContainer hideNav />

      {/* 5. 파트너쉽 섹션 */}
      <PartnershipSection />

      {/* 6. Meet the team 섹션 */}
      <TeamSection />

      {/* 7. Faq 섹션 */}
      <FaqContainer hideBuy hideNav />

      {/* Disclaimer 섹션 wrapper */}
      <div
        className={"w-full"}
        style={{
          backgroundColor: "rgba(249, 251, 251, 1)",
          marginTop: 0,
          paddingBottom: "36px",
          paddingTop: "40px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          className={
            "flex flex-col w-full max-w-[1312px] mx-auto px-6 md:px-6 py-12 md:py-[48px] rounded-2xl"
          }
          style={{
            borderBottomWidth: "1px",
            gap: "12px",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(7, 20, 25, 1)",
          }}
        >
          {/* 저작권 텍스트와 소셜 아이콘 */}
          <div
            className={
              "flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0"
            }
          >
            <p className={"text-neutral-100 text-sm md:text-base font-medium"}>
              ⓒ 2025 GOTCAR. All Rights Reserved.
            </p>
            <div className={"flex items-center gap-4"}>
              <a
                className={
                  "cursor-pointer w-6 h-6 relative flex items-center justify-center"
                }
                target={"_blank"}
                rel={"noopener noreferrer"}
                href={"https://www.binance.com/en"}
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
                href={"https://t.me/GOTCAR_Official"}
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
            className={
              "text-neutral-100 text-xs md:text-sm leading-5 md:leading-6"
            }
          >
            GOTCAR Token is not a security or investment product.
            <br />
            Cryptocurrency investments involve the risk of loss.
          </p>
        </div>
      </div>
    </>
  );
};
