"use client";

import { useTranslations } from "next-intl";
import { RoadmapContainer } from "@/app/v2/[locale]/roadmap/components/container";
import { FaqContainer } from "@/app/v2/[locale]/faq/components/container";
import { HeroSection } from "@/app/v2/[locale]/(home)/components/hero-section";
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
        style={{
          backgroundColor: "rgba(249, 251, 251, 1)",
          width: "100%",
          marginTop: 0,
          paddingBottom: "36px",
        }}
      >
        <div
          className={"flex flex-col"}
          style={{
            width: "1312px",
            height: "210px",
            maxWidth: "1312px",
            borderRadius: "16px",
            borderBottomWidth: "1px",
            paddingTop: "48px",
            paddingRight: "24px",
            paddingBottom: "48px",
            paddingLeft: "24px",
            gap: "16px",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(7, 20, 25, 1)",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p className={"text-body-1b text-neutral-100"}>
            ⓒ 2025 GOTCAR. All Rights Reserved.
          </p>
          <p className={"text-body-1 text-neutral-100"}>
            GOTCAR Token is not a security or investment product.
            <br />
            Cryptocurrency investments involve the risk of loss.
          </p>
        </div>
      </div>
    </>
  );
};
