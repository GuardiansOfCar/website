"use client";

import { Main } from "@/app/v2/components/main";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const ExperienceSection = () => {
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
    <div className={"bg-white"}>
      <Main
        leftHref={""}
        rightHref={""}
        hideNav
        horizontalPadding={"px-0 max-desktop:px-5"}
      >
        <section
          className={"flex flex-col space-y-6 md:space-y-8 py-6 md:py-10"}
          aria-labelledby="experience-heading"
        >
          <header className={"text-center space-y-2 px-4"}>
            <h2
              id="experience-heading"
              className={
                "font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-center"
              }
            >
              From Engineering to{" "}
              <span className={"text-sub-primary"}>Experience</span>
            </h2>
            {/* Our Services with lines */}
            <div
              className={"flex items-center justify-center mt-6 md:mt-12"}
              style={{ gap: "12px", marginTop: "24px" }}
            >
              <div
                className={"h-0 border-t hidden md:block flex-1"}
                style={{
                  maxWidth: "571px",
                  borderColor: "#E0E1E5",
                  borderWidth: "1px",
                }}
              />
              <p
                className={
                  "text-center align-middle whitespace-nowrap text-base md:text-[20px] leading-6 md:leading-[28px]"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  color: "#78797C",
                  verticalAlign: "middle",
                }}
              >
                Our Services
              </p>
              <div
                className={"h-0 border-t hidden md:block flex-1"}
                style={{
                  maxWidth: "571px",
                  borderColor: "#E0E1E5",
                  borderWidth: "1px",
                }}
              />
            </div>
          </header>

          <div
            ref={cardsRef}
            className={
              "grid grid-cols-1 md:grid-cols-3 mt-6 md:mt-8 w-full max-w-[1312px] mx-auto gap-4 md:gap-4 px-4 md:px-0"
            }
          >
            {/* Left Column - Top Card */}
            <div
              className={
                `border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 transition-all duration-300 ease-out`
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: opacity,
                transform: `translateX(${-30 * (1 - opacity)}px) translateY(${20 * (1 - opacity)}px)`,
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col"}>
                {/* 아이콘 */}
                <Image
                  src={"/images/g23-3d-icon.png"}
                  alt={
                    "G2E Guardians-To-Earn - Data Contribution Rewards Service Icon"
                  }
                  title={
                    "G2E (Guardians-To-Earn) - Earn tokens by contributing driving data"
                  }
                  width={64}
                  height={64}
                  className={"object-contain w-12 h-12 md:w-16 md:h-16"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div className={"mt-3 md:mt-4"}>
                  <h3
                    className={
                      "font-bold text-base md:text-[18px] leading-6 md:leading-[26px] text-[#0F0F0F] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    G2E (Guardians-To-Earn)
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Data Contribution Rewards
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Earn tokens by contributing driving data and reporting road
                    risks.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Card - Large */}
            <div
              className={
                `border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col md:row-span-2 relative p-4 md:p-6 transition-all duration-300 ease-out`
              }
              style={{
                width: "100%",
                maxWidth: "427px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "300px",
                opacity: opacity,
                transform: `translateY(${30 * (1 - opacity)}px)`,
                transitionDelay: "0.1s",
              }}
            >
              {/* 타이틀 */}
              <h3
                className={
                  "font-bold text-base md:text-[18px] leading-6 md:leading-[26px] text-[#0F0F0F] mb-3 md:mb-4"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                AI Risk Alert
              </h3>

              {/* 텍스트 영역 */}
              <div className={"mb-4 md:mb-6"}>
                <p
                  className={
                    "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  Real-time Risk Prediction
                </p>
                <p
                  className={
                    "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  Detects hazards such as collisions, wrong-way driving, and
                  severe weather conditions.
                </p>
              </div>

              {/* 아이콘 */}
              <div className={"flex items-center justify-center mt-auto"}>
                <Image
                  src={"/images/ai-alert-risk-3d-icon.png"}
                  alt={"AI Risk Alert - Real-time Risk Prediction Service Icon"}
                  title={
                    "AI Risk Alert - Real-time risk prediction for safer driving"
                  }
                  width={378}
                  height={316}
                  className={
                    "object-contain w-full max-w-[280px] md:max-w-[378px] h-auto"
                  }
                  loading={"lazy"}
                />
              </div>
            </div>

            {/* Right Column - Top Card */}
            <div
              className={
                `border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 transition-all duration-300 ease-out`
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: opacity,
                transform: `translateX(${30 * (1 - opacity)}px) translateY(${20 * (1 - opacity)}px)`,
                transitionDelay: "0.15s",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col"}>
                {/* 아이콘 */}
                <Image
                  src={"/images/precision-parking-3d-icon.png"}
                  alt={
                    "Precision Parking - Indoor Parking Assistance Service Icon"
                  }
                  title={
                    "Precision Parking - Indoor parking navigation and spot detection"
                  }
                  width={64}
                  height={64}
                  className={"object-contain w-12 h-12 md:w-16 md:h-16"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div className={"mt-3 md:mt-4"}>
                  <h3
                    className={
                      "font-bold text-base md:text-[18px] leading-6 md:leading-[26px] text-[#0F0F0F] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Precision Parking
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Indoor Parking Assistance
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Tracks vehicle position to locate empty spots and navigate
                    within indoor areas.
                  </p>
                </div>
              </div>
            </div>

            {/* Left Column - Bottom Card */}
            <div
              className={
                `border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 transition-all duration-300 ease-out`
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: opacity,
                transform: `translateX(${-30 * (1 - opacity)}px) translateY(${-20 * (1 - opacity)}px)`,
                transitionDelay: "0.2s",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col"}>
                {/* 아이콘 */}
                <Image
                  src={"/images/smart-payment-3d-icon.png"}
                  alt={"Smart Payment - In-Vehicle Payment Service Icon"}
                  title={
                    "Smart Payment - Seamless in-vehicle payment solutions"
                  }
                  width={64}
                  height={64}
                  className={"object-contain w-12 h-12 md:w-16 md:h-16"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div className={"mt-3 md:mt-4"}>
                  <h3
                    className={
                      "font-bold text-base md:text-[18px] leading-6 md:leading-[26px] text-[#0F0F0F] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Smart Payment
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    In-Vehicle Payment
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Supports payments for parking, charging, and insurance
                    directly from the car.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Bottom Card */}
            <div
              className={
                `border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 transition-all duration-300 ease-out`
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: opacity,
                transform: `translateX(${30 * (1 - opacity)}px) translateY(${-20 * (1 - opacity)}px)`,
                transitionDelay: "0.25s",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col"}>
                {/* 아이콘 */}
                <Image
                  src={"/images/mobility-analytics-3d-icon.png"}
                  alt={"Mobility Analytics - B2B Data Insights Service Icon"}
                  title={
                    "Mobility Analytics - Advanced mobility data analytics for businesses"
                  }
                  width={64}
                  height={64}
                  className={"object-contain w-12 h-12 md:w-16 md:h-16"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div className={"mt-3 md:mt-4"}>
                  <h3
                    className={
                      "font-bold text-base md:text-[18px] leading-6 md:leading-[26px] text-[#0F0F0F] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Mobility Analytics
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    B2B Data Insights
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    Provides analytical mobility data services for city
                    planners, traffic agencies, and OEMs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </div>
  );
};
