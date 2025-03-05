"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersOnePage() {
  const t = useTranslations();

  return (
    <Main leftHref={"/"} rightHref={"/chapters/2"}>
      <div className={"flex space-x-6 items-start px-10"}>
        <ChaptersSection
          section={t("chapter.chapterOne1")}
          title={t("chapter.chapterOne2")}
        >
          {t("chapter.chapterOne3")}
        </ChaptersSection>

        <Image
          src={"/images/chapter1.png"}
          alt={"c1"}
          width={400}
          height={400}
        />

        <BuyGoCar />
      </div>
    </Main>
  );
}
