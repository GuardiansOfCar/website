"use client";

import { useTranslations } from "next-intl";
import { RoadmapContainer } from "@/app/v2/[locale]/roadmap/components/container";
import { FaqContainer } from "@/app/v2/[locale]/faq/components/container";
import { HeroSection } from "@/app/v2/[locale]/(home)/components/hero-section";
import { TechnologiesSection } from "@/app/v2/[locale]/(home)/components/technologies-section";
import { ExperienceSection } from "@/app/v2/[locale]/(home)/components/experience-section";
import { GuardianSection } from "@/app/v2/[locale]/(home)/components/guardian-section";
import { PartnershipSection } from "@/app/v2/[locale]/(home)/components/partnership-section";
import { TeamSection } from "@/app/v2/[locale]/(home)/components/team-section";
import { CopyrightFooter } from "@/app/v2/components/copyright-footer";

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
        <CopyrightFooter />
      </div>
    </>
  );
};
