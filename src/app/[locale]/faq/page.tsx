"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";
import { FaqSection } from "@/app/[locale]/faq/components/section";

export default function FaqsPage() {
  const t = useTranslations();

  return (
    <Main leftHref={"/roadmap"} rightHref={"/staking"}>
      <div className={"flex space-x-6"}>
        <div className={"flex flex-col"}>
          <h2 className={"text-header-2 text-primary mx-10 mb-4"}>
            {t("faqs.a1")}
          </h2>

          <div className={"flex space-x-6 items-start px-10"}>
            <div className={"flex flex-col space-y-4"}>
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

            <div className={"w-[400px] flex-col flex justify-end items-end h-full self-stretch"}>
              <div className={"flex ml-auto w-[240px] -rotate-[20deg] "}>
                <div
                  className={
                    "bg-neutral-100 p-4 border-neutral-0 border-4 flex-col items-center flex"
                  }
                >
                  <p className={"text-body-1"}>{t("faqs.h1")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BuyGoCar />
      </div>
    </Main>
  );
}
