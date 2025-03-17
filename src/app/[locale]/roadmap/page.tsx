"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { RoadmapSection } from "@/app/[locale]/roadmap/components/section";
import Image from "next/image";

export default function RoadmapPage() {
  const t = useTranslations();

  return (
    <div className={"bg-hero"}>
      <Main leftHref={"/howtobuy"} rightHref={"/faq"}>
        <h2 className={"text-header-2 text-primary mx-10 mb-4"}>
          {t("roadmap.a1")}
        </h2>

        <div className={"flex space-x-6 items-start px-10 relative"}>
          <div className={"flex flex-col space-y-4"}>
            <div
              className={
                "border-4 border-neutral-0 bg-neutral-100 flex items-end p-9 space-x-[14px]"
              }
            >
              <div className={"flex flex-col items-center space-y-2"}>
                <p className={"text-label-1 text-primary-0"}>30,000%</p>
                <Image
                  src={"/images/up.png"}
                  alt={"up"}
                  width={14}
                  height={12}
                />
                <div
                  className={
                    "self-stretch bg-neutral-0 flex flex-col items-center justify-center h-[70px]"
                  }
                >
                  <Image
                    src={"/images/tesla.png"}
                    alt={"t"}
                    width={34}
                    height={34}
                  />
                </div>
                <p className={"text-body-2b"}>CAR</p>
              </div>
              <p className={"text-body-2b"}>+</p>

              <div className={"flex flex-col items-center space-y-2"}>
                <p className={"text-label-1 text-primary-0"}>500,000%</p>
                <Image
                  src={"/images/up.png"}
                  alt={"up"}
                  width={14}
                  height={12}
                />
                <div
                  className={
                    "self-stretch bg-[#F0B90B] flex flex-col items-center justify-center h-[185px]"
                  }
                >
                  <Image
                    src={"/images/bnb2.png"}
                    alt={"t"}
                    width={34}
                    height={34}
                  />
                </div>
                <p className={"text-body-2b"}>UTILITY</p>
              </div>
              <p className={"text-body-2b"}>+</p>

              <div className={"flex flex-col items-center space-y-2"}>
                <p className={"text-label-1 text-primary-0"}>700,000%</p>
                <Image
                  src={"/images/up.png"}
                  alt={"up"}
                  width={14}
                  height={12}
                />
                <div
                  className={
                    "self-stretch bg-[#F00500] flex flex-col items-center justify-center h-[260px] "
                  }
                >
                  <Image
                    src={"/images/shiba.png"}
                    alt={"t"}
                    width={34}
                    height={34}
                  />
                </div>
                <p className={"text-body-2b"}>MEME</p>
              </div>
              <p className={"text-body-2b"}>=</p>

              <div className={"flex flex-col items-center space-y-2"}>
                <p className={"text-label-1 text-primary-0"}>??????%</p>
                <Image
                  src={"/images/up.png"}
                  alt={"up"}
                  width={14}
                  height={12}
                />
                <div
                  className={
                    "self-stretch bg-neutral-0 flex flex-col items-center justify-center h-[354px] relative"
                  }
                >
                  <Image
                    src={"/images/pepe-bg.png"}
                    alt={"bg"}
                    sizes={"100vw"}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  <Image
                    className={"absolute z-10"}
                    src={"/images/pepe.png"}
                    alt={"t"}
                    width={34}
                    height={34}
                  />
                </div>
                <p className={"text-body-2b text-primary-10"}>GOCAR</p>
              </div>
            </div>
            <div
              className={"relative w-[400px] flex items-center justify-center"}
            >
              <p
                className={
                  "text-header-4 text-[#47433C] absolute block z-[2] px-[80px] text-center"
                }
              >
                {t("roadmap.h1")}
              </p>
              <Image
                className={" w-full h-auto z-[1]"}
                src={"/images/pap.png"}
                alt={"Pap"}
                width={0}
                height={0}
                sizes={"100vw"}
              />
            </div>
          </div>

          <div className={"flex flex-col space-y-10"}>
            <RoadmapSection title={t("roadmap.b1")}>
              {t("roadmap.b2")}
            </RoadmapSection>
            <RoadmapSection right title={t("roadmap.c1")}>
              {t("roadmap.c2")}
              <br />
              <br />
              {t("roadmap.c3")}
            </RoadmapSection>
            <RoadmapSection title={t("roadmap.d1")}>
              {t("roadmap.d2")}
              <br />
              <br />
              {t("roadmap.d3")}
            </RoadmapSection>

            <RoadmapSection right title={t("roadmap.e1")}>
              {t("roadmap.e2")}
              <br />
              <br />
              {t("roadmap.e3")}
            </RoadmapSection>
          </div>

          <Image
            className={"w-[1243px] h-[884px] absolute right-0 translate-x-1/3"}
            src={"/images/roadmap.gif"}
            alt={"staking"}
            width={1243}
            height={884}
            objectFit={"cover"}
          />
        </div>

        <div className={"flex flex-col items-center justify-center mt-10"}>
          <p className={"text-body-1b text-neutral-100"}>{t("roadmap.f1")}</p>
          <p className={"text-body-1 text-neutral-100 text-center"}>
            {t("roadmap.g1")}
          </p>
        </div>
      </Main>
    </div>
  );
}
