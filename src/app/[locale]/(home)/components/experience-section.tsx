"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const ExperienceSection = () => {
  const t = useTranslations();
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [card1Opacity, setCard1Opacity] = useState(0);
  const [card2Opacity, setCard2Opacity] = useState(0);
  const [card3Opacity, setCard3Opacity] = useState(0);
  const [card4Opacity, setCard4Opacity] = useState(0);
  const [card5Opacity, setCard5Opacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 초기값을 0으로 설정
    setCard1Opacity(0);
    setCard2Opacity(0);
    setCard3Opacity(0);
    setCard4Opacity(0);
    setCard5Opacity(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // intersectionRatio를 사용하여 스크롤 위치에 따라 opacity 계산
          // 0.2 (20%) 보일 때부터 시작해서 0.5 (50%) 보일 때 완전히 나타남
          const ratio = entry.intersectionRatio;
          let calculatedOpacity = 0;

          if (ratio < 0.2) {
            calculatedOpacity = 0;
          } else if (ratio >= 0.5) {
            calculatedOpacity = 1;
          } else {
            // 0.2 ~ 0.5 사이에서 부드럽게 전환
            calculatedOpacity = (ratio - 0.2) / 0.3;
          }

          if (entry.target === card1Ref.current) {
            setCard1Opacity(calculatedOpacity);
          } else if (entry.target === card2Ref.current) {
            setCard2Opacity(calculatedOpacity);
          } else if (entry.target === card3Ref.current) {
            setCard3Opacity(calculatedOpacity);
          } else if (entry.target === card4Ref.current) {
            setCard4Opacity(calculatedOpacity);
          } else if (entry.target === card5Ref.current) {
            setCard5Opacity(calculatedOpacity);
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0부터 1까지 0.01 단위
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);
    if (card4Ref.current) observer.observe(card4Ref.current);
    if (card5Ref.current) observer.observe(card5Ref.current);

    return () => {
      if (card1Ref.current) observer.unobserve(card1Ref.current);
      if (card2Ref.current) observer.unobserve(card2Ref.current);
      if (card3Ref.current) observer.unobserve(card3Ref.current);
      if (card4Ref.current) observer.unobserve(card4Ref.current);
      if (card5Ref.current) observer.unobserve(card5Ref.current);
    };
  }, []);

  // PC에서 그리드 상단 마진을 40px로 설정
  useEffect(() => {
    const updateMargin = () => {
      if (gridRef.current) {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        gridRef.current.style.marginTop = isDesktop ? "40px" : "24px";
      }
    };

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  // 모바일 감지 및 카드 순서 설정
  useEffect(() => {
    const updateMobileAndOrder = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setIsMobile(!isDesktop);

      // 카드 순서 설정
      if (card1Ref.current) {
        card1Ref.current.style.order = isDesktop ? "0" : "1";
      }
      if (card2Ref.current) {
        card2Ref.current.style.order = isDesktop ? "0" : "3";
      }
      if (card3Ref.current) {
        card3Ref.current.style.order = isDesktop ? "0" : "4";
      }
      if (card4Ref.current) {
        card4Ref.current.style.order = isDesktop ? "0" : "2";
      }
      if (card5Ref.current) {
        card5Ref.current.style.order = isDesktop ? "0" : "5";
      }
    };

    updateMobileAndOrder();
    window.addEventListener("resize", updateMobileAndOrder);
    return () => window.removeEventListener("resize", updateMobileAndOrder);
  }, []);

  return (
    <div className={"bg-white"}>
      <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-4"}>
        <section
          className={
            "flex flex-col w-full max-w-[1312px] mx-auto overflow-hidden"
          }
          aria-labelledby="experience-heading"
        >
          <header className={"text-center"}>
            <h2
              id="experience-heading"
              className={
                "font-bold text-[22px] md:text-[40px] leading-[32px] md:leading-[48px] mt-10 md:mt-0 text-center whitespace-nowrap"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
                letterSpacing: "normal",
              }}
            >
              {t("home.experience.title")}{" "}
              <span className={"text-sub-primary"}>
                {t("home.experience.titleHighlight")}
              </span>
            </h2>
            {/* Our Services with lines */}
            <div
              className={
                "flex items-center justify-center mt-6 md:mt-12 w-full mt-6 md:mt-24"
              }
            >
              <div
                className={"h-0 border-t flex-1"}
                style={{
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
                {t("home.experience.subtitle")}
              </p>
              <div
                className={"h-0 border-t flex-1"}
                style={{
                  borderColor: "#E0E1E5",
                  borderWidth: "1px",
                }}
              />
            </div>
          </header>

          <div
            ref={gridRef}
            className={
              "grid grid-cols-1 md:grid-cols-3 mt-6 w-full max-w-[1312px] mx-auto gap-4 md:gap-4 overflow-hidden"
            }
          >
            {/* Left Column - Top Card */}
            <div
              ref={card1Ref}
              className={`border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 items-center md:items-start text-center md:text-left`}
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: card1Opacity,
                transform: isMobile
                  ? `translateY(${20 * (1 - card1Opacity)}px)`
                  : `translateX(${-30 * (1 - card1Opacity)}px) translateY(${20 * (1 - card1Opacity)}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col items-center md:items-start"}>
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
                  className={"object-contain w-16 h-16 md:w-16 md:h-16"}
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
                    {t("home.experience.g2e.title")}
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.g2e.subtitle")}
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.g2e.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Card - Large */}
            <div
              ref={card2Ref}
              className={`border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col md:row-span-2 relative p-4 md:p-6 items-center md:items-start text-center md:text-left`}
              style={{
                width: "100%",
                maxWidth: "427px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "300px",
                opacity: card2Opacity,
                transform: `translateY(${30 * (1 - card2Opacity)}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
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
                {t("home.experience.aiRisk.title")}
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
                  {t("home.experience.aiRisk.subtitle")}
                </p>
                <p
                  className={
                    "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  {t("home.experience.aiRisk.description")}
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
                  width={379}
                  height={316}
                  className={
                    "object-contain w-[228px] h-[190px] md:w-[379px] md:h-[316px]"
                  }
                  loading={"lazy"}
                />
              </div>
            </div>

            {/* Right Column - Top Card */}
            <div
              ref={card3Ref}
              className={`border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 items-center md:items-start text-center md:text-left`}
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: card3Opacity,
                transform: isMobile
                  ? `translateY(${20 * (1 - card3Opacity)}px)`
                  : `translateX(${30 * (1 - card3Opacity)}px) translateY(${20 * (1 - card3Opacity)}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                transitionDelay: "0.15s",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col items-center md:items-start"}>
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
                  className={"object-contain w-16 h-16 md:w-16 md:h-16"}
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
                    {t("home.experience.parking.title")}
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.parking.subtitle")}
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.parking.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Left Column - Bottom Card */}
            <div
              ref={card4Ref}
              className={`border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 items-center md:items-start text-center md:text-left`}
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: card4Opacity,
                transform: isMobile
                  ? `translateY(${-20 * (1 - card4Opacity)}px)`
                  : `translateX(${-30 * (1 - card4Opacity)}px) translateY(${-20 * (1 - card4Opacity)}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                transitionDelay: "0.2s",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col items-center md:items-start"}>
                {/* 아이콘 */}
                <Image
                  src={"/images/smart-payment-3d-icon.png"}
                  alt={"Smart Payment - In-Vehicle Payment Service Icon"}
                  title={
                    "Smart Payment - Seamless in-vehicle payment solutions"
                  }
                  width={64}
                  height={64}
                  className={"object-contain w-16 h-16 md:w-16 md:h-16"}
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
                    {t("home.experience.payment.title")}
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.payment.subtitle")}
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.payment.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Bottom Card */}
            <div
              ref={card5Ref}
              className={`border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative p-4 md:p-6 items-center md:items-start text-center md:text-left`}
              style={{
                width: "100%",
                maxWidth: "426px",
                borderRadius: "16px",
                gap: "8px",
                minHeight: "auto",
                opacity: card5Opacity,
                transform: isMobile
                  ? `translateY(${-20 * (1 - card5Opacity)}px)`
                  : `translateX(${30 * (1 - card5Opacity)}px) translateY(${-20 * (1 - card5Opacity)}px)`,
                transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                transitionDelay: "0.25s",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div className={"flex flex-col items-center md:items-start"}>
                {/* 아이콘 */}
                <Image
                  src={"/images/mobility-analytics-3d-icon.png"}
                  alt={"Mobility Analytics - B2B Data Insights Service Icon"}
                  title={
                    "Mobility Analytics - Advanced mobility data analytics for businesses"
                  }
                  width={64}
                  height={64}
                  className={"object-contain w-16 h-16 md:w-16 md:h-16"}
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
                    {t("home.experience.analytics.title")}
                  </h3>
                  <p
                    className={
                      "font-bold text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60] mb-2"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.analytics.subtitle")}
                  </p>
                  <p
                    className={
                      "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                    }
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {t("home.experience.analytics.description")}
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
