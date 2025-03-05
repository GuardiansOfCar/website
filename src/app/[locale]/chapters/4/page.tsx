"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersFourPage() {
  const t = useTranslations();
  return (
    <Main leftHref={"/chapters/3"} rightHref={"/howtobuy"}>
      <div className={"flex space-x-6 items-start px-10"}>
        <ChaptersSection
          section={t("chapter.chapterFour1")}
          title={t("chapter.chapterFour2")}
        >
          {t("chapter.chapterFour3")}
        </ChaptersSection>

        <Image
          src={"/images/chapter4.png"}
          alt={"c2"}
          width={400}
          height={400}
        />

        <BuyGoCar />
      </div>
    </Main>
  );
}
