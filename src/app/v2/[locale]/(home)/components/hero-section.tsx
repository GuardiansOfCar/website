"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const HeroSection = () => {
  const t = useTranslations();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // intersectionRatio를 사용하여 스크롤 위치에 따라 opacity 계산
          // 0.2 (20%) 보일 때부터 시작해서 0.5 (50%) 보일 때 완전히 나타남
          const ratio = entry.intersectionRatio;
          if (ratio < 0.2) {
            setOpacity(0);
          } else if (ratio >= 0.5) {
            setOpacity(1);
          } else {
            // 0.2 ~ 0.5 사이에서 부드럽게 전환
            setOpacity((ratio - 0.2) / 0.3);
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0부터 1까지 0.01 단위
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => {
      if (cardsRef.current) {
        observer.unobserve(cardsRef.current);
      }
    };
  }, []);

  return (
    <div className={"relative w-full hero-gradient-overlay -mt-[94px]"}>
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

        {/* 그라데이션 마스크 - 1920px 이상일 때 좌우 자연스러운 전환 */}
        <div className={"absolute inset-0 pointer-events-none z-[2]"}>
          <div
            className={
              "hidden xl:block absolute left-0 top-0 bottom-0 w-[100px]"
            }
            style={{
              background:
                "linear-gradient(to right, #030711, rgba(3, 7, 17, 0.5), transparent)",
            }}
          />
          <div
            className={
              "hidden xl:block absolute right-0 top-0 bottom-0 w-[100px]"
            }
            style={{
              background:
                "linear-gradient(to left, #030711, rgba(3, 7, 17, 0.5), transparent)",
            }}
          />
        </div>

        {/* Hero 텍스트 섹션 - GIF 정 중앙 */}
        <section
          className={
            "absolute inset-0 z-10 flex flex-col items-center justify-center text-center space-y-6 px-4"
          }
        >
          <h1
            className={
              "font-bold text-[72px] leading-[80px] text-center text-neutral-100"
            }
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
              className={"text-primary inline-block animate-slide-in-from-left"}
            >
              Zero
            </span>{" "}
            Doubt.
          </h1>
          <p
            className={
              "font-normal text-[18px] leading-[26px] text-center text-neutral-100 max-w-4xl"
            }
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

      {/* Engineering the Next Mobility Era 섹션 - GIF 아래 */}
      <div
        className={"relative z-10"}
        style={{
          background: "#030711",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
          overflow: "hidden",
          marginBottom: "32px",
        }}
      >
        <div
          className={
            "w-full max-w-[var(--max-width)] mx-auto py-10 md:py-20 px-4 md:px-24"
          }
          style={{
            paddingBottom: "calc(2.5rem + 32px)",
          }}
        >
          <section
            className={
              "flex flex-col space-y-8 md:space-y-12 py-8 md:py-16 pb-10 md:pb-20"
            }
            aria-labelledby="technologies-heading"
          >
            <header
              className={
                "text-center flex flex-col items-center gap-6 md:gap-12"
              }
            >
              <h2
                id="technologies-heading"
                className={
                  "text-xl md:text-[32px] leading-tight md:leading-[40px] font-bold px-4"
                }
              >
                <span className={"text-neutral-100"}>Engineering the </span>
                <span
                  className={"inline-block animate-text-reveal"}
                  style={{
                    background:
                      "radial-gradient(ellipse 134.33% 152.08% at 0.16% -11.46%, #007F83 0%, #21EAF1 58.65%, #007F83 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    animationDelay: "0.3s",
                    opacity: 0,
                  }}
                >
                  Next Mobility Era
                </span>
              </h2>
              {/* 서브헤딩 with 가로선 */}
              <div
                className={
                  "flex items-center justify-center gap-3 md:gap-6 w-full px-4"
                }
              >
                <div
                  className={"h-0 border-t flex-1 hidden md:block"}
                  style={{
                    maxWidth: "549px",
                    borderColor: "rgba(0, 55, 73, 1)",
                  }}
                />
                <p
                  className={
                    "text-center align-middle text-base md:text-[20px] leading-6 md:leading-[28px] font-bold whitespace-nowrap shrink-0"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    color: "#006882",
                  }}
                >
                  Our Technologies
                </p>
                <div
                  className={"h-0 border-t flex-1 hidden md:block"}
                  style={{
                    maxWidth: "549px",
                    borderColor: "rgba(0, 55, 73, 1)",
                  }}
                />
              </div>
            </header>

            <div
              ref={cardsRef}
              className={"grid grid-cols-1 md:grid-cols-3 gap-4"}
            >
              {/* Card 1: Precision Positioning AI Engine */}
              <div
                className={`bg-[#121A26] rounded-2xl flex flex-col p-4 md:p-6 transition-all duration-300 ease-out`}
                style={{
                  width: "100%",
                  maxWidth: "427px",
                  height: "auto",
                  border: "1px solid rgba(0, 40, 52, 1)",
                  opacity: opacity,
                  transform: `translateY(${20 * (1 - opacity)}px)`,
                }}
              >
                <Image
                  src={"/images/precision-positioning-ai-engine.png"}
                  alt={"Precision Positioning AI Engine Icon"}
                  title={
                    "Precision Positioning AI Engine - Sub-meter accuracy location tracking"
                  }
                  width={48}
                  height={48}
                  className={
                    "object-contain mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12"
                  }
                  loading={"lazy"}
                />
                <h3
                  className={
                    "font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-neutral-100 mb-6 md:mb-10"
                  }
                >
                  Precision Positioning AI Engine
                </h3>
                <p
                  className={
                    "text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal mt-auto"
                  }
                >
                  Tracks your exact location with sub-meter accuracy, even
                  inside tunnels or underground parking areas — making
                  lane-level navigation possible.
                </p>
              </div>

              {/* Card 2: Mobility Data Blockchain */}
              <div
                className={`bg-[#121A26] rounded-2xl flex flex-col p-4 md:p-6 transition-all duration-300 ease-out`}
                style={{
                  width: "100%",
                  maxWidth: "427px",
                  height: "auto",
                  border: "1px solid rgba(0, 40, 52, 1)",
                  opacity: opacity,
                  transform: `translateY(${20 * (1 - opacity)}px)`,
                  transitionDelay: "0.1s",
                }}
              >
                <Image
                  src={"/images/mobility-data-blockchain.png"}
                  alt={"Mobility Data Blockchain Icon"}
                  title={
                    "Mobility Data Blockchain - Secure and anonymous data sharing"
                  }
                  width={48}
                  height={48}
                  className={
                    "object-contain mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12"
                  }
                  loading={"lazy"}
                />
                <h3
                  className={
                    "font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-neutral-100 mb-6 md:mb-10"
                  }
                >
                  Mobility Data Blockchain
                </h3>
                <p
                  className={
                    "text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal mt-auto"
                  }
                >
                  Uses blockchain to securely share driving data while keeping
                  it anonymous — ensuring transparency and trust across the
                  network.
                </p>
              </div>

              {/* Card 3: AI Mobility Agent */}
              <div
                className={`bg-[#121A26] rounded-2xl flex flex-col p-4 md:p-6 transition-all duration-300 ease-out`}
                style={{
                  width: "100%",
                  maxWidth: "427px",
                  height: "auto",
                  border: "1px solid rgba(0, 40, 52, 1)",
                  opacity: opacity,
                  transform: `translateY(${20 * (1 - opacity)}px)`,
                  transitionDelay: "0.2s",
                }}
              >
                <Image
                  src={"/images/ai-mobility-agent.png"}
                  alt={"AI Mobility Agent Icon"}
                  title={
                    "AI Mobility Agent - Real-time risk prediction and smart guidance"
                  }
                  width={48}
                  height={48}
                  className={
                    "object-contain mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12"
                  }
                  loading={"lazy"}
                />
                <h3
                  className={
                    "font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-neutral-100 mb-6 md:mb-10"
                  }
                >
                  AI Mobility Agent
                </h3>
                <p
                  className={
                    "text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal mt-auto"
                  }
                >
                  Analyzes driving behavior and road conditions to predict risks
                  in real time and offer smart, personalized guidance for every
                  driver.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
