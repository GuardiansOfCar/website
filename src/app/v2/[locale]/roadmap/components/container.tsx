"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";

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
    description:
      "Promotion of B2B data partnerships (with OEMs, navigation companies, etc.)",
  },
];

export const RoadmapContainer = ({ hideNav }: { hideNav?: boolean }) => {
  const t = useTranslations();

  return (
    <div className={"bg-[#F9FBFB]"}>
      <Main
        leftHref={hideNav ? "" : "/howtobuy"}
        rightHref={hideNav ? "" : "/faq"}
        hideNav={hideNav}
        horizontalPadding={"px-0 max-desktop:px-5"}
      >
        <div
          className={
            "flex flex-col space-y-6 md:space-y-8 py-6 md:py-10 px-4 md:px-0"
          }
        >
          <h2
            className={
              "text-center font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-[#0F0F0F]"
            }
            style={{
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {t("roadmap.a1")}
          </h2>

          {/* New area below Our Roadmap */}
          <div
            className={
              "w-full max-w-[1312px] mx-auto rounded-3xl p-4 md:p-4 mt-6 md:mt-12"
            }
            style={{
              boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.04)",
              backgroundColor: "rgba(255, 255, 255, 1)",
            }}
          >
            <div className={"flex flex-col md:flex-row gap-4 md:gap-4 w-full"}>
              {ROADMAP_PHASES.map((item, index) => (
                <div
                  key={index}
                  className={
                    "flex flex-col rounded-2xl gap-2 p-4 md:p-6 w-full md:w-auto md:flex-1"
                  }
                  style={{
                    backgroundColor: "rgba(249, 251, 251, 1)",
                    border: "1px solid rgba(237, 238, 240, 1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
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
        </div>
      </Main>
    </div>
  );
};
