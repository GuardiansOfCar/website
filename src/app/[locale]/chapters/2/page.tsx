"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersTwoPage() {
  const t = useTranslations();
  return (
    <>
      <Main leftHref={"/chapters/1"} rightHref={"/chapters/3"}>
        <div className={"flex space-x-6 items-start px-10"}>
          <ChaptersSection
            section={t("chapter.chapterTwo1")}
            title={t("chapter.chapterTwo2")}
          >
            {t("chapter.chapterTwo3")}
            <br />
            {t("chapter.chapterTwo4")}
            <br />
            <br />
            {t("chapter.chapterTwo5")}
            <br />
            {t("chapter.chapterTwo6")}
            <br />
            {t("chapter.chapterTwo7")}
            <br />
            <br />
            {t("chapter.chapterTwo8")}
            <br />
          </ChaptersSection>

          <div className={"w-[400px]"} />

          <BuyGoCar />
        </div>
      </Main>

      <div className={"absolute bottom-0 left-0 z-[1]"}>
        <Image
          src={"/images/chapter2.gif"}
          alt={"c1"}
          width={1012}
          height={720}
        />
      </div>
    </>
  );
}
