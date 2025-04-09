"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";
import { FaqSection } from "@/app/[locale]/faq/components/section";
import { useState } from "react";

export const FaqContainer = ({ hideBuy }: { hideBuy?: boolean }) => {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState<undefined | number>(0);

  return (
    <div className={"bg-hero"}>
      <Main leftHref={"/roadmap"} rightHref={"/staking"}>
        <div
          className={
            "grid grid-cols-3 gap-6 max-laptop:flex max-laptop:flex-col w-full"
          }
        >
          <div className={"flex flex-col"}>
            <h2 className={"text-header-2 text-primary mb-4"}>
              {t("faqs.a1")}
            </h2>

            <div className={"flex space-x-6 items-start"}>
              <div className={"flex flex-col space-y-4"}>
                <FaqSection
                  open={openIndex === 0}
                  onOpen={(t) => {
                    setOpenIndex(t ? 0 : undefined);
                  }}
                  title={t("faqs.b1")}
                >
                  {t("faqs.b2")}
                  <br />
                  <br />
                  {t("faqs.b3")}
                </FaqSection>
                <FaqSection
                  open={openIndex === 1}
                  onOpen={(t) => {
                    setOpenIndex(t ? 1 : undefined);
                  }}
                  title={t("faqs.c1")}
                >
                  {t("faqs.c2")}
                  <br />
                  <br />
                  {t("faqs.c3")}
                </FaqSection>
                <FaqSection
                  open={openIndex === 2}
                  onOpen={(t) => {
                    setOpenIndex(t ? 2 : undefined);
                  }}
                  title={t("faqs.d1")}
                >
                  {t("faqs.d2")}
                  <br />
                  <br />
                  {t("faqs.d3")}
                </FaqSection>
                <FaqSection
                  open={openIndex === 3}
                  onOpen={(t) => {
                    setOpenIndex(t ? 3 : undefined);
                  }}
                  title={t("faqs.e1")}
                >
                  {t("faqs.e2")}
                  <br />
                  <br />
                  {t("faqs.e3")}
                </FaqSection>
                <FaqSection
                  open={openIndex === 4}
                  onOpen={(t) => {
                    setOpenIndex(t ? 4 : undefined);
                  }}
                  title={t("faqs.f1")}
                >
                  {t("faqs.f2")}
                  <br />
                  <br />
                  {t("faqs.f3")}
                </FaqSection>
                <FaqSection
                  open={openIndex === 5}
                  onOpen={(t) => {
                    setOpenIndex(t ? 5 : undefined);
                  }}
                  title={t("faqs.g1")}
                >
                  {t("faqs.g2")}
                  <br />
                  <br />
                  {t("faqs.g3")}
                </FaqSection>
              </div>
            </div>
          </div>

          <div className={"flex-col flex"}>
            <div
              className={
                "flex ml-auto w-[240px] -rotate-[20deg] mt-auto mb-10  max-laptop:ml-10 max-laptop:mt-10"
              }
            >
              <div
                className={
                  "bg-neutral-100 p-4 border-neutral-0 border-4 flex-col items-center flex"
                }
              >
                <p className={"text-body-1"}>{t("faqs.h1")}</p>
              </div>
            </div>
          </div>

          <div
            className={
              "relative items-end mt-10 justify-between hidden max-laptop:flex"
            }
          >
            <Image
              className={"self-start"}
              src={"/images/faq-left.gif"}
              alt={"cs"}
              width={280}
              height={130}
            />
            s
            <Image
              src={"/images/faq.png"}
              alt={"cs"}
              width={200}
              className="absolute  right-0"
              height={200}
            />
          </div>

          {!hideBuy && <BuyGoCar />}
        </div>

        <div
          className={
            "w-[1250px] h-[320px] relative flex items-center justify-between max-laptop:hidden"
          }
        >
          <Image
            className={"self-start"}
            src={"/images/faq-left.gif"}
            alt={"cs"}
            width={600}
            height={300}
          />

          <Image
            src={"/images/faq.png"}
            alt={"cs"}
            width={320}
            className="absolute  left-1/2  -translate-x-1/2"
            height={320}
          />
          <Image
            className={"self-end -scale-x-100"}
            src={"/images/faq-left.gif"}
            alt={"cs"}
            width={600}
            height={300}
          />
        </div>
      </Main>
    </div>
  );
};
