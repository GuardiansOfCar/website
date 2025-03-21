"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";
import { HowtobuySection } from "@/app/[locale]/howtobuy/components/section";

export default function HowToBuyPage() {
  const t = useTranslations();

  return (
    <div className={"bg-hero"}>
      <Main leftHref={"/chapters/4"} rightHref={"/roadmap"}>
        <div
          className={
            "grid grid-cols-3 gap-6 max-laptop:flex max-laptop:flex-col max-laptop:items-stretch"
          }
        >
          <div className={"flex flex-col"}>
            <h2 className={"text-header-2 text-primary mb-4"}>
              {t("howToBuy.a1")}
            </h2>

            <div className={"flex flex-col space-y-4"}>
              <HowtobuySection
                defaultOpened
                title={t("howToBuy.b1")}
                openClassName={"!bg-primary-90"}
              >
                {t("howToBuy.b2")}
              </HowtobuySection>
              <HowtobuySection
                title={t("howToBuy.c1")}
                openClassName={"!bg-[#FADEFC]"}
              >
                {t("howToBuy.c2")}
              </HowtobuySection>
              <HowtobuySection
                title={t("howToBuy.d1")}
                openClassName={"!bg-[#FBF3D2]"}
              >
                {t("howToBuy.d2")}
              </HowtobuySection>
            </div>
          </div>

          <div
            className={
              "relative flex-col flex self-start max-laptop:self-stretch"
            }
          >
            <div className={"flex flex-col items-centers mb-20"}>
              <div
                className={
                  "bg-primary-80 border-neutral-0 border-4 pt-3  flex flex-col items-center space-y-4 pb-4"
                }
              >
                <span className={"text-header-3"}>{t("howToBuy.e1")}</span>
                <div className={"text-header-2 text-center"}>
                  {t("howToBuy.e2")
                    .split(" ")
                    .map((i, idx) => (
                      <span
                        key={i}
                        className={clsx(
                          idx === 0 && "text-neutral-100 shadow-text",
                        )}
                      >
                        {idx !== 0 && " "}
                        {i}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className={"relative flex flex-col items-center justify-center"}>
              <div className={"absolute right-0 -top-[26%] z-[1]"}>
                <div className={"relative flex items-center justify-center"}>
                  <Image
                    src={"/images/ppp.png"}
                    alt={"p"}
                    width={206}
                    height={195}
                  />

                  <div className={"absolute z-[2] -translate-y-4 px-10"}>
                    <p className={"text-center text-title-1"}>
                      {t("howToBuy.f1")}
                    </p>
                  </div>
                </div>
              </div>

              <Image
                className={"z-[2] mt-auto relative self-start"}
                src={"/images/howtobuy.png"}
                alt={"how to buy"}
                width={330}
                height={330}
              />
            </div>
          </div>

          <BuyGoCar />
        </div>
      </Main>
    </div>
  );
}
