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
        <div
          className={
            "grid grid-cols-3 gap-6 max-laptop:flex max-laptop:flex-col"
          }
        >
          <ChaptersSection
            section={t("chapter.chapterThree1")}
            title={t("chapter.chapterThree2")}
          >
            {t("chapter.chapterThree3")}
            <br />
            <br />
            {t("chapter.chapterThree4")}
          </ChaptersSection>


          <div className={"max-laptop:hidden"} />

          <div className={"hidden max-laptop:block relative w-full"}>
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

          <BuyGoCar />
        </div>
      </Main>

      <div
        className={"z-[2] bottom-0 absolute left-0 right-0 max-laptop:hidden"}
      >
        <div className={"w-full max-w-[var(--max-width)] mx-auto"}>
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
