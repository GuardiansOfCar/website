"use client";

import { useTranslations } from "next-intl";
import { RoadmapContainer } from "@/app/[locale]/roadmap/components/container";
import { FaqContainer } from "@/app/[locale]/faq/components/container";
import { HeroSection } from "@/app/[locale]/(home)/components/hero-section";
import { ExperienceSection } from "@/app/[locale]/(home)/components/experience-section";
import { GuardianSection } from "@/app/[locale]/(home)/components/guardian-section";
import { PartnershipSection } from "@/app/[locale]/(home)/components/partnership-section";
import { TeamSection } from "@/app/[locale]/(home)/components/team-section";

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

            {/* Disclaimer */}
            <div className={"flex flex-col items-center justify-center mt-10 pb-10"}>
                <p className={"text-body-1b text-neutral-100"}>{t("roadmap.f1")}</p>
                <p className={"text-body-1 text-neutral-100 text-center"}>
                    {t("roadmap.g1")}
                </p>
            </div>
        </>
    );
}