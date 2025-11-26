"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { FaqSection } from "@/app/[locale]/faq/components/section";
import { CopyrightFooter } from "@/components/copyright-footer";

export function FaqPageClient() {
  const t = useTranslations();

  return (
    <Main leftHref={""} rightHref={""} hideNav>
      <div className={"bg-white min-h-screen"}>
        <div
          className={
            "flex flex-col items-center px-4 py-10 md:py-16 max-w-[1312px] mx-auto"
          }
        >
          {/* Title */}
          <h1
            className={
              "text-2xl md:text-[40px] font-bold text-[#0F0F0F] mb-8 md:mb-12 text-center"
            }
            style={{ fontFamily: "Pretendard, sans-serif" }}
          >
            {t("faqs.a1")}
          </h1>

          {/* FAQ List */}
          <div className={"flex flex-col space-y-4 w-full max-w-[800px]"}>
            <FaqSection defaultOpened title={t("faqs.b1")}>
              {t("faqs.b2")}
              <br />
              <br />
              {t("faqs.b3")}
            </FaqSection>
            <FaqSection title={t("faqs.c1")}>
              {t("faqs.c2")}
              <br />
              <br />
              {t("faqs.c3")}
            </FaqSection>
            <FaqSection title={t("faqs.d1")}>
              {t("faqs.d2")}
              <br />
              <br />
              {t("faqs.d3")}
            </FaqSection>
            <FaqSection title={t("faqs.e1")}>
              {t("faqs.e2")}
              <br />
              <br />
              {t("faqs.e3")}
            </FaqSection>
            <FaqSection title={t("faqs.f1")}>
              {t("faqs.f2")}
              <br />
              <br />
              {t("faqs.f3")}
            </FaqSection>
            <FaqSection title={t("faqs.g1")}>
              {t("faqs.g2")}
              <br />
              <br />
              {t("faqs.g3")}
            </FaqSection>
          </div>

          {/* Quote */}
          <div className={"mt-12 md:mt-16 text-center"}>
            <p
              className={
                "text-sm md:text-base text-[#78797C] italic max-w-[600px]"
              }
              style={{ fontFamily: "Pretendard, sans-serif" }}
            >
              {t("faqs.h1")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={"w-full"}
          style={{
            backgroundColor: "rgba(249, 251, 251, 1)",
            paddingBottom: "36px",
            paddingTop: "40px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <CopyrightFooter />
        </div>
      </div>
    </Main>
  );
}
