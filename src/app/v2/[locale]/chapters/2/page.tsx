"use client";

import { Main } from "@/components/main";
import { ChaptersSection } from "@/app/[locale]/chapters/components/section";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BuyGoCar } from "@/components/buy-go-car";

export default function ChaptersTwoPage() {
  const t = useTranslations();
  return (
    <div className={""}>
      <Main
        leftHref={"/chapters/1"}
        rightHref={"/chapters/3"}
        absoluteComponent={
          <div
            className={
              "w-[200px] h-[400px] absolute -bottom-[160px] right-0 z-[4] max-laptop:w-[100px] max-laptop:h-[200px] max-laptop:-bottom-[80px]"
            }
          >
            <Image src={"/images/chapter2-2.png"} alt={"c1"} fill className={"object-contain"} />
          </div>
        }
      >
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

          <div className={"hidden max-laptop:block relative w-full relative"}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={"w-full h-auto"}
            >
              <source src="/images/chapter2.mp4" type="video/mp4" />
              <source src="/images/chapter2.gif" type="image/gif" />
            </video>

            <Image
              src={"/images/chapter2-4.png"}
              alt={"c1"}
              width={140}
              height={170}
              className={"absolute left-0 bottom-0"}
            />

            <Image
              src={"/images/chapter2-3.png"}
              alt={"c1"}
              width={200}
              height={140}
              className={"absolute top-0  right-[30%]"}
            />

            <Image
              src={"/images/chapter2-1.png"}
              alt={"c1"}
              width={240}
              height={170}
              className={"absolute top-0 right-0"}
            />
          </div>

          <BuyGoCar />
        </div>
      </Main>

      <div
        className={"z-[2] bottom-0 absolute left-0 right-0 max-laptop:hidden"}
      >
        <div className={"w-full max-w-[var(--max-width)] mx-auto relative"}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={"w-full h-auto"}
            style={{ width: '1012px', height: '720px', objectFit: 'cover' }}
          >
            <source src="/images/chapter2.mp4" type="video/mp4" />
            <source src="/images/chapter2.gif" type="image/gif" />
          </video>

          <Image
            src={"/images/chapter2-4.png"}
            alt={"c1"}
            width={400}
            height={400}
            className={"absolute left-0 bottom-0"}
          />

          <Image
            src={"/images/chapter2-3.png"}
            alt={"c1"}
            width={450}
            height={320}
            className={"absolute top-0 left-1/3  -translate-x-1/2"}
          />

          <Image
            src={"/images/chapter2-1.png"}
            alt={"c1"}
            width={560}
            height={400}
            className={"absolute top-0 left-1/2  -translate-x-1/2"}
          />
        </div>
      </div>
    </div>
  );
}
