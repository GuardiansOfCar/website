"use client";

import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations();

  return (
    <div className={"relative w-full"}>
      <div
        className={"relative w-full hero-gradient-overlay -mt-[94px]"}
        style={{
          overflow: "hidden",
        }}
      >
        {/* Hero Video Background - 최적화된 MP4 사용 (높이 630px) */}
        <div className={"relative w-full h-[630px] z-0 bg-[#030711]"}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={
              "absolute inset-0 w-full h-full object-cover object-center"
            }
            style={{ zIndex: 0 }}
          >
            <source src="/images/hero.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support MP4 */}
            <source src="/images/Hero.gif" type="image/gif" />
          </video>

          {/* 그라데이션 오버레이 - 하단 페이드 */}
          <div
            className={"absolute inset-0 z-[1] pointer-events-none"}
            style={{
              background:
                "linear-gradient(180deg, rgba(3, 7, 17, 0) 0%, #030711 100%)",
            }}
          />

          {/* 그라데이션 마스크 - 데스크톱에서만 좌우 자연스러운 전환 */}
          <div
            className={
              "absolute inset-0 pointer-events-none z-[2] hidden md:block"
            }
          >
            <div
              className={"absolute left-0 top-0 bottom-0 w-[50px] xl:w-[100px]"}
              style={{
                background:
                  "linear-gradient(to right, #030711, rgba(3, 7, 17, 0.5), transparent)",
              }}
            />
            <div
              className={
                "absolute right-0 top-0 bottom-0 w-[50px] xl:w-[100px]"
              }
              style={{
                background:
                  "linear-gradient(to left, #030711, rgba(3, 7, 17, 0.5), transparent)",
              }}
            />
          </div>

          {/* Hero 텍스트 섹션 - Mp4 정 중앙 */}
          <section
            className={
              "absolute inset-0 z-10 flex flex-col items-center justify-center text-center space-y-6 px-4"
            }
          >
            <h1
              className={
                "font-bold text-[40px] md:text-[72px] leading-[48px] md:leading-[80px] text-center text-neutral-100"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              <span
                className={
                  "text-primary inline-block animate-slide-in-from-right"
                }
              >
                Zero
              </span>{" "}
              Accidents.
              <br />
              <span
                className={
                  "text-primary inline-block animate-slide-in-from-left"
                }
              >
                Zero
              </span>{" "}
              Doubt.
            </h1>
            <p
              className={
                "font-normal text-[15px] md:text-[18px] leading-[22px] md:leading-[26px] text-center text-neutral-100 max-w-4xl"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
              }}
            >
              GOTCAR transforms real-time driving data into secure, private, and
              valuable digital assets.
              <br />
              Powered by our AI Mobility Agent, it builds a safer, smarter, and
              decentralized mobility ecosystem —
              <br />
              where every driver becomes a vital data node.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
