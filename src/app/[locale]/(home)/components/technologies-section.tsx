"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const TechnologiesSection = () => {
  const t = useTranslations();
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const [card1Visible, setCard1Visible] = useState(false);
  const [card2Visible, setCard2Visible] = useState(false);
  const [card3Visible, setCard3Visible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const isVisible = ratio > 0.2;

          if (entry.target === card1Ref.current) {
            setCard1Visible(isVisible);
          } else if (entry.target === card2Ref.current) {
            setCard2Visible(isVisible);
          } else if (entry.target === card3Ref.current) {
            setCard3Visible(isVisible);
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);

    return () => {
      if (card1Ref.current) observer.unobserve(card1Ref.current);
      if (card2Ref.current) observer.unobserve(card2Ref.current);
      if (card3Ref.current) observer.unobserve(card3Ref.current);
    };
  }, []);

  return (
    <div
      className={
        "bg-[#030711] rounded-b-[24px] md:rounded-b-[32px] overflow-hidden"
      }
    >
      <Main
        leftHref={""}
        rightHref={""}
        hideNav
        horizontalPadding="px-4 md:px-16"
        verticalPadding="pt-20 pb-20 max-desktop:pt-10 max-desktop:pb-6"
      >
        <section
          className={"flex flex-col space-y-8 md:space-y-12"}
          aria-labelledby="technologies-heading"
        >
          <header
            className={
              "text-center flex flex-col items-center space-y-3 md:space-y-4"
            }
          >
            <h2
              id="technologies-heading"
              className={
                "flex flex-col md:flex-row md:items-center md:justify-center text-center"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
              }}
            >
              <span
                className={"text-neutral-100"}
                style={{
                  fontSize: "24px",
                  lineHeight: "32px",
                }}
              >
                {t("home.technologies.title")}
              </span>
              <span
                className={"md:inline-block md:ml-1"}
                style={{
                  background:
                    "radial-gradient(ellipse 134.33% 152.08% at 0.16% -11.46%, #007F83 0%, #21EAF1 58.65%, #007F83 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontSize: "24px",
                  lineHeight: "32px",
                }}
              >
                {t("home.technologies.titleHighlight")}
              </span>
            </h2>
          </header>
          {/* Our Technologies with lines */}
          <div
            className={"flex items-center justify-center mt-6 md:mt-12"}
            style={{ gap: "12px" }}
          >
            <div
              className={"h-0 border-t flex-1"}
              style={{
                maxWidth: "571px",
                border: "1px solid rgba(0, 55, 73, 1)",
              }}
            />
            <p
              className={
                "text-center align-middle whitespace-nowrap text-base md:text-[20px] leading-6 md:leading-[28px]"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
                color: "#006882",
                verticalAlign: "middle",
              }}
            >
              {t("home.technologies.subtitle")}
            </p>
            <div
              className={"h-0 border-t flex-1"}
              style={{
                maxWidth: "571px",
                border: "1px solid rgba(0, 55, 73, 1)",
              }}
            />
          </div>

          <div
            className={"grid grid-cols-1 md:grid-cols-3 gap-4"}
            style={{ marginTop: "40px" }}
          >
            {/* Card 1: Precision Positioning AI Engine */}
            <div
              ref={card1Ref}
              className={"flex flex-col transition-all duration-700 ease-out"}
              style={{
                width: "100%",
                maxWidth: "426.67px",
                minWidth: "282.67px",
                height: "370px",
                borderRadius: "16px",
                border: "1px solid rgba(0, 40, 52, 1)",
                backgroundColor: "rgba(7, 20, 25, 1)",
                padding: "24px",
                opacity: card1Visible ? 1 : 0,
                transform: card1Visible ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div
                className={
                  "w-12 h-12 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg"
                }
                style={{ marginBottom: "16px" }}
              >
                <Image
                  src={"/images/precision-positioning-ai-engine.png"}
                  alt={"Precision Positioning AI Engine Icon"}
                  title={
                    "Precision Positioning AI Engine - Sub-meter accuracy location tracking"
                  }
                  width={48}
                  height={48}
                  className={"object-contain w-12 h-12"}
                  loading={"lazy"}
                />
              </div>
              <h3
                className={"text-2xl"}
                style={{
                  marginBottom: "auto",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: "48px",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                {t("home.technologies.precision.title")}
              </h3>
              <p
                className={
                  "text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal"
                }
                style={{ paddingBottom: "8px" }}
              >
                {t("home.technologies.precision.description")}
              </p>
            </div>

            {/* Card 2: Mobility Data Blockchain */}
            <div
              ref={card2Ref}
              className={"flex flex-col transition-all duration-700 ease-out"}
              style={{
                width: "100%",
                maxWidth: "426.67px",
                minWidth: "282.67px",
                height: "370px",
                borderRadius: "16px",
                border: "1px solid rgba(0, 40, 52, 1)",
                backgroundColor: "rgba(7, 20, 25, 1)",
                padding: "24px",
                opacity: card2Visible ? 1 : 0,
                transform: card2Visible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "100ms",
              }}
            >
              <div
                className={
                  "w-12 h-12 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg"
                }
                style={{ marginBottom: "16px" }}
              >
                <Image
                  src={"/images/mobility-data-blockchain.png"}
                  alt={"Mobility Data Blockchain Icon"}
                  title={
                    "Mobility Data Blockchain - Secure and anonymous data sharing"
                  }
                  width={48}
                  height={48}
                  className={"object-contain w-12 h-12"}
                  loading={"lazy"}
                />
              </div>
              <h3
                className={"text-2xl"}
                style={{
                  marginBottom: "auto",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: "48px",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                {t("home.technologies.blockchain.title")}
              </h3>
              <p
                className={
                  "text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal"
                }
                style={{ paddingBottom: "8px" }}
              >
                {t("home.technologies.blockchain.description")}
              </p>
            </div>

            {/* Card 3: AI Mobility Agent */}
            <div
              ref={card3Ref}
              className={"flex flex-col transition-all duration-700 ease-out"}
              style={{
                width: "100%",
                maxWidth: "426.67px",
                minWidth: "282.67px",
                height: "370px",
                borderRadius: "16px",
                border: "1px solid rgba(0, 40, 52, 1)",
                backgroundColor: "rgba(7, 20, 25, 1)",
                padding: "24px",
                opacity: card3Visible ? 1 : 0,
                transform: card3Visible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "200ms",
              }}
            >
              <div
                className={
                  "w-12 h-12 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg"
                }
                style={{ marginBottom: "16px" }}
              >
                <Image
                  src={"/images/ai-mobility-agent.png"}
                  alt={"AI Mobility Agent Icon"}
                  title={
                    "AI Mobility Agent - Real-time risk prediction and smart guidance"
                  }
                  width={48}
                  height={48}
                  className={"object-contain w-12 h-12"}
                  loading={"lazy"}
                />
              </div>
              <h3
                className={"text-2xl"}
                style={{
                  marginBottom: "auto",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: "48px",
                  color: "rgba(255, 255, 255, 1)",
                }}
              >
                {t("home.technologies.agent.title")}
              </h3>
              <p
                className={
                  "text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal"
                }
                style={{ paddingBottom: "8px" }}
              >
                {t("home.technologies.agent.description")}
              </p>
            </div>
          </div>
        </section>
      </Main>
    </div>
  );
};
