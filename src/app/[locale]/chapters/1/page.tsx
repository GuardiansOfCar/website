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
        <div
          className={
            "grid grid-cols-3 gap-6  overflow-hidden max-laptop:flex max-laptop:flex-col"
          }
        >
          <ChaptersSection
            section={t("chapter.chapterOne1")}
            title={t("chapter.chapterOne2")}
          >
            {t("chapter.chapterOne3")}
          </ChaptersSection>
          <div className={"max-laptop:self-center"}>
            <div
              className={
                "absolute left-[50%] w-[570px] h-[406px] -translate-x-[50%]  max-laptop:w-[280px] max-laptop:h-[200px] max-laptop:-translate-y-10"
              }
            >
              <Image src={"/images/chapter1.gif"} alt={"c1"} fill />
            </div>
          </div>

          <div className={"hidden max-laptop:block relative w-full"}>
            <Image
              src={"/images/chapter1b.png"}
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
            src={"/images/chapter1b.png"}
            alt={"c1"}
            width={1017}
            height={700}
          />
        </div>
      </div>
    </>
  );
}
