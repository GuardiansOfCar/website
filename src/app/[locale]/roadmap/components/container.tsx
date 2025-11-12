"use client";

import { Main } from "@/components/main";
import {useTranslations} from "next-intl";

const ROADMAP_PHASES = [
  {
    phase: "Phase 1",
    period: "2025 Q3",
    description: "Launch of Guardian App and AI Mobility Agent testing",
  },
  {
    phase: "Phase 2",
    period: "2025 Q4",
    description: "CEX listing and G2E App launch",
  },
  {
    phase: "Phase 3",
    period: "2026 Q1",
    description: "Launch of AI Mobility Agent and advancement of the G2E App",
  },
  {
    phase: "Phase 4",
    period: "2026 Q2",
    description: "Promotion of B2B data partnerships (with OEMs, navigation companies, etc.)",
  },
];

export const RoadmapContainer = ({ hideNav }: { hideNav?: boolean }) => {
  const t = useTranslations();

  return (
    <div className={"bg-[#F9FBFB]"}>
      <Main leftHref={hideNav ? "" : "/howtobuy"} rightHref={hideNav ? "" : "/faq"} hideNav={hideNav}>
        <div className={"flex flex-col space-y-8 py-10"}>
          <h2 className={"text-header-2 text-primary mb-4"}>{t("roadmap.a1")}</h2>

          <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"}>
            {ROADMAP_PHASES.map((item, index) => (
              <div
                key={index}
                className={"border-neutral-0 border-4 bg-neutral-100 p-6 flex flex-col space-y-4"}
              >
                <div className={"space-y-2"}>
                  <h3 className={"text-header-4 text-primary-10 font-bold"}>
                    {item.phase}
                  </h3>
                  <p className={"text-body-2 text-neutral-0 font-bold"}>
                    {item.period}
                  </p>
                </div>
                <p className={"text-body-3 text-neutral-0"}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Main>
    </div>
  );
};
