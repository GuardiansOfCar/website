"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersOnePage() {
  const t = useTranslations();

  return (
    <>
      <Main leftHref={"/"} rightHref={"/chapters/2"}>
        <div className={"flex space-x-6 items-start px-10 justify-center"}>
          <ChaptersSection
            section={t("chapter.chapterOne1")}
            title={t("chapter.chapterOne2")}
          >
            {t("chapter.chapterOne3")}
          </ChaptersSection>
          <div className={"w-[400px]"} />
          <Image
            className={"absolute"}
            src={"/images/chapter1.gif"}
            alt={"c1"}
            width={570}
            height={406}
          />

          <BuyGoCar />
        </div>
      </Main>

      <div className={"absolute bottom-0 left-0 z-[1]"}>
        <Image
          src={"/images/chapter1b.png"}
          alt={"c1"}
          width={1017}
          height={700}
        />
      </div>
    </>
  );
}
