"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersThreePage() {
  const t = useTranslations();
  return (
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

        <Image
          src={"/images/chapter3.png"}
          alt={"c2"}
          width={400}
          height={400}
        />

        <BuyGoCar />
      </div>
    </Main>
  );
}
