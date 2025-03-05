"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { RoadmapSection } from "@/app/[locale]/roadmap/components/section";
import Image from "next/image";

export default function RoadmapPage() {
  const t = useTranslations();

  return (
    <Main leftHref={"/howtobuy"} rightHref={"/faq"}>
      <h2 className={"text-header-2 text-primary mx-10 mb-4"}>
        {t("roadmap.a1")}
      </h2>

      <div className={"flex space-x-6 items-start px-10"}>
        <div
          className={
            "border-4 border-neutral-0 bg-neutral-100 flex items-end p-9 space-x-[14px]"
          }
        >
          <div className={"flex flex-col items-center space-y-2"}>
            <p className={"text-label-1 text-primary-0"}>30,000%</p>
            <Image src={"/images/up.png"} alt={"up"} width={14} height={12} />
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
            <Image src={"/images/up.png"} alt={"up"} width={14} height={12} />
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
            <Image src={"/images/up.png"} alt={"up"} width={14} height={12} />
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
            <Image src={"/images/up.png"} alt={"up"} width={14} height={12} />
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
      </div>

      <div className={"flex ml-auto w-[240px] -rotate-[20deg] "}>
        <div
          className={
            "bg-neutral-100 p-4 border-neutral-0 border-4 flex-col items-center flex"
          }
        >
          <p className={"text-body-1b"}>{t("roadmap.f1")}</p>
          <p className={"text-body-1"}>{t("roadmap.g1")}</p>
        </div>
      </div>
    </Main>
  );
}
