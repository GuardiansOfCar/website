"use client";

import { useTranslations } from "next-intl";
import { HeroSection } from "@/app/[locale]/(home)/components/hero-section";
import { TechnologiesSection } from "@/app/[locale]/(home)/components/technologies-section";
import { ExperienceSection } from "@/app/[locale]/(home)/components/experience-section";
import { GuardianSection } from "@/app/[locale]/(home)/components/guardian-section";
import { PartnershipSection } from "@/app/[locale]/(home)/components/partnership-section";
import { TeamSection } from "@/app/[locale]/(home)/components/team-section";
import { FaqSection } from "@/app/[locale]/(home)/components/faq-section";
import { CopyrightFooter } from "@/components/copyright-footer";

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

      {/* 4. 파트너쉽 섹션 */}
      <PartnershipSection />

      {/* 5. Meet the team 섹션 */}
      <TeamSection />

      {/* 6. FAQ 섹션 */}
      <FaqSection />

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
