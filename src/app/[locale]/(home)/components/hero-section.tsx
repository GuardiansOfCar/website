"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const HeroSection = () => {
  const t = useTranslations();

  return (
    <div
      className={
        "relative w-full bg-[#030711] hero-gradient-overlay -mt-[94px]"
      }
    >
      {/* Hero GIF Background - SEO 최적화 (높이 630px) */}
      <div className={"relative w-full h-[630px] z-0"}>
        <img
          src={"/images/Hero.gif"}
          alt={"GOTCAR Hero - AI-Powered Mobility Ecosystem Background"}
          title={"GOTCAR - Zero Accidents. Zero Doubt."}
          className={"w-full h-full object-cover object-center"}
          loading={"eager"}
          fetchPriority={"high"}
        />

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
              "hidden xl:block absolute left-0 top-0 bottom-0 w-[200px]"
            }
            style={{
              background:
                "linear-gradient(to right, #030711, rgba(3, 7, 17, 0.5), transparent)",
            }}
          />
          <div
            className={
              "hidden xl:block absolute right-0 top-0 bottom-0 w-[200px]"
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
            <span className={"text-primary"}>Zero</span> Accidents.
            <br />
            <span className={"text-primary"}>Zero</span> Doubt.
          </h1>
          <p
            className={
              "font-normal text-[18px] leading-[26px] text-center text-neutral-100 max-w-4xl"
            }
          >
            GOTCAR transforms real-time driving data into secure, private, and
            valuable digital assets. Powered by our AI Mobility Agent, it builds
            a safer, smarter, and decentralized mobility ecosystem — where every
            driver becomes a vital data node.
          </p>
        </section>
      </div>

      {/* Engineering the Next Mobility Era 섹션 - GIF 아래 */}
      <div
        className={
          "relative z-10 bg-[#030711] rounded-b-[32px] overflow-hidden"
        }
      >
        <div
          className={
            "w-full max-w-[var(--max-width)] mx-auto py-20 px-24 max-desktop:py-8 max-desktop:px-5"
          }
        >
          <section
            className={"flex flex-col space-y-12 py-16 pb-20"}
            aria-labelledby="technologies-heading"
          >
            <header
              className={"text-center flex flex-col items-center space-y-4"}
            >
              <h2
                id="technologies-heading"
                className={"text-[32px] leading-[40px] font-bold"}
              >
                <span className={"text-neutral-100"}>Engineering the </span>
                <span
                  className={"inline-block"}
                  style={{
                    background:
                      "radial-gradient(ellipse 134.33% 152.08% at 0.16% -11.46%, #007F83 0%, #21EAF1 58.65%, #007F83 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Next Mobility Era
                </span>
              </h2>
              {/* 가로선 */}
              <div className={"w-full max-w-[600px] h-[1px] bg-neutral-100"} />
              {/* 서브헤딩 */}
              <p className={"text-[#00C8C8] text-lg font-normal"}>
                Our Technologies
              </p>
            </header>

            <div className={"grid grid-cols-1 md:grid-cols-3 gap-6"}>
              {/* Card 1: Precision Positioning AI Engine */}
              <div
                className={
                  "bg-[#121A26] rounded-2xl p-6 flex flex-col space-y-4 pb-8"
                }
              >
                <div
                  className={
                    "w-16 h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"
                  }
                >
                  <Image
                    src={"/images/precision-positioning-ai-engine.png"}
                    alt={"Precision Positioning AI Engine Icon"}
                    title={
                      "Precision Positioning AI Engine - Sub-meter accuracy location tracking"
                    }
                    width={48}
                    height={48}
                    className={"object-contain"}
                    loading={"lazy"}
                  />
                </div>
                <h3
                  className={
                    "font-bold text-[40px] leading-[48px] text-neutral-100"
                  }
                >
                  Precision Positioning AI Engine
                </h3>
                <p
                  className={
                    "text-[14px] leading-[22px] text-neutral-100 font-normal mt-auto"
                  }
                >
                  Tracks your exact location with sub-meter accuracy, even
                  inside tunnels or underground parking areas — making
                  lane-level navigation possible.
                </p>
              </div>

              {/* Card 2: Mobility Data Blockchain */}
              <div
                className={
                  "bg-[#121A26] rounded-2xl p-6 flex flex-col space-y-4 pb-8"
                }
              >
                <div
                  className={
                    "w-16 h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"
                  }
                >
                  <Image
                    src={"/images/mobility-data-blockchain.png"}
                    alt={"Mobility Data Blockchain Icon"}
                    title={
                      "Mobility Data Blockchain - Secure and anonymous data sharing"
                    }
                    width={48}
                    height={48}
                    className={"object-contain"}
                    loading={"lazy"}
                  />
                </div>
                <h3
                  className={
                    "font-bold text-[40px] leading-[48px] text-neutral-100"
                  }
                >
                  Mobility Data Blockchain
                </h3>
                <p
                  className={
                    "text-[14px] leading-[22px] text-neutral-100 font-normal mt-auto"
                  }
                >
                  Uses blockchain to securely share driving data while keeping
                  it anonymous — ensuring transparency and trust across the
                  network.
                </p>
              </div>

              {/* Card 3: AI Mobility Agent */}
              <div
                className={
                  "bg-[#121A26] rounded-2xl p-6 flex flex-col space-y-4 pb-8"
                }
              >
                <div
                  className={
                    "w-16 h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"
                  }
                >
                  <Image
                    src={"/images/ai-mobility-agent.png"}
                    alt={"AI Mobility Agent Icon"}
                    title={
                      "AI Mobility Agent - Real-time risk prediction and smart guidance"
                    }
                    width={48}
                    height={48}
                    className={"object-contain"}
                    loading={"lazy"}
                  />
                </div>
                <h3
                  className={
                    "font-bold text-[40px] leading-[48px] text-neutral-100"
                  }
                >
                  AI Mobility Agent
                </h3>
                <p
                  className={
                    "text-[14px] leading-[22px] text-neutral-100 font-normal mt-auto"
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
