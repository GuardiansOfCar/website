"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersFourPage() {
  const t = useTranslations();
  return (
    <div className={"relative"}>
      <Main leftHref={"/chapters/3"} rightHref={"/howtobuy"}>
        <div className={"flex space-x-6 items-start px-10"}>
          <ChaptersSection
            section={t("chapter.chapterFour1")}
            title={t("chapter.chapterFour2")}
          >
            {t("chapter.chapterFour3")}
          </ChaptersSection>

          <div className={"w-[400px]"} />

          <BuyGoCar />
        </div>
      </Main>

      <div className={"z-[2] bottom-0 absolute left-0 right-0"}>
        <div className={"w-full max-w-[var(--max-width)] mx-auto"}>
          <Image
            src={"/images/chapter4.gif"}
            alt={"c1"}
            width={1012}
            height={720}
          />
        </div>
      </div>
    </div>
  );
}
