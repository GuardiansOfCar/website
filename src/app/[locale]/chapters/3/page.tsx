"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersThreePage() {
  const t = useTranslations();
  return (
    <>
      <Main leftHref={"/chapters/2"} rightHref={"/chapters/4"}>
        <div className={"flex space-x-6 items-start px-10"}>
          <ChaptersSection
            section={t("chapter.chapterThree1")}
            title={t("chapter.chapterThree2")}
          >
            {t("chapter.chapterThree3")}
            <br />
            <br />
            {t("chapter.chapterThree4")}
          </ChaptersSection>

          <div className={"w-[400px]"} />

          <BuyGoCar />
        </div>
      </Main>
      <div className={"absolute bottom-0 left-0 z-[1] flex flex-col right-0"}>
        <div className={"w-full relative z-[3]"}>
          <Image
            src={"/images/chapter3.gif"}
            alt={"c1"}
            width={0}
            height={0}
            sizes={"100vw"}
            className={"w-full h-auto"}
            objectFit={"cover"}
          />
        </div>
      </div>
    </>
  );
}
