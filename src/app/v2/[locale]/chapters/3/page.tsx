"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersThreePage() {
  const t = useTranslations();
  return (
    <div className={""}>
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
              <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={"w-full h-auto"}
              >
                  <source src="/images/chapter3.mp4" type="video/mp4" />
                  <source src="/images/chapter3.gif" type="image/gif" />
              </video>
          </div>

          <BuyGoCar />
        </div>
      </Main>

      <div
        className={"z-[2] bottom-0 absolute left-0 right-0 max-laptop:hidden"}
      >
        <div className={"w-full max-w-[var(--max-width)] mx-auto"}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={"w-full h-auto"}
          >
            <source src="/images/chapter3.mp4" type="video/mp4" />
            <source src="/images/chapter3.gif" type="image/gif" />
          </video>
        </div>
      </div>
    </div>
  );
}
