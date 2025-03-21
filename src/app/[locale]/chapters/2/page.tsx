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
        <div
          className={
            "grid grid-cols-3 gap-6 max-laptop:flex max-laptop:flex-col"
          }
        >
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

          <div className={"max-laptop:hidden"} />

          <div className={"hidden max-laptop:block relative w-full"}>
            <Image
              src={"/images/chapter2.gif"}
              alt={"c1"}
              sizes={"100vw"}
              className={"w-full h-auto"}
              width={0}
              height={0}
            />
          </div>

          <BuyGoCar />
        </div>
      </Main>

      <div
        className={"z-[2] bottom-0 absolute left-0 right-0 max-laptop:hidden"}
      >
        <div className={"w-full max-w-[var(--max-width)] mx-auto"}>
          <Image
            src={"/images/chapter2.gif"}
            alt={"c1"}
            width={1012}
            height={720}
          />
        </div>
      </div>
    </>
  );
}
