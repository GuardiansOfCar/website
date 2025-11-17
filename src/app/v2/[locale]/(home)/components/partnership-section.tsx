"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FEATURES } from "@/app/v2/lib/constants";
import { useEffect, useMemo, useRef, useState } from "react";

export const PartnershipSection = () => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [features, setFeatures] = useState<
    Array<{ url: string; imagePath: string; isImage: boolean }>
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  // 파트너십 데이터 (새로운 로고 이미지 3개 + 나머지는 텍스트)
  const validFeatures = useMemo(() => {
    const newLogos = [
      {
        url: "#",
        imagePath: "/images/synergy-ib-investment-logo.png",
        isImage: true,
      },
      { url: "#", imagePath: "/images/upgradepart2-logo.png", isImage: true },
      { url: "#", imagePath: "/images/CENTROID-logo.png", isImage: true },
    ];

    // 나머지는 "partner" 텍스트로 채움
    const textPartners = Array.from({ length: 5 }, () => ({
      url: "#",
      imagePath: "",
      isImage: false,
    }));

    return [...newLogos, ...textPartners];
  }, []);

  useEffect(() => {
    // 초기 3세트로 시작
    setFeatures([...validFeatures, ...validFeatures, ...validFeatures]);

    const container = containerRef.current;
    if (!container || validFeatures.length === 0) return;

    let animationFrameId: number;
    let lastTransform = 0;

    const checkProgress = () => {
      const computedStyle = window.getComputedStyle(container);
      const transform = computedStyle.transform;

      if (transform && transform !== "none") {
        const matrix = new DOMMatrix(transform);
        const currentTransform = matrix.e; // translateX 값

        // 한 세트의 너비를 계산 (각 아이템 너비 + 간격)
        // 모바일: 135px, PC: 180px + 24px (gap-x-6 = 1.5rem = 24px)
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const itemWidth = (isDesktop ? 180 : 135) + 24;
        const setWidth = itemWidth * validFeatures.length;

        // 한 세트만큼 이동했는지 확인
        if (currentTransform <= lastTransform - setWidth) {
          setFeatures((prev) => {
            const newFeatures = [...prev];
            // 첫 세트 제거
            newFeatures.splice(0, validFeatures.length);
            // 새로운 세트 추가
            return [...newFeatures, ...validFeatures];
          });
          lastTransform = currentTransform;
        }
      }

      animationFrameId = requestAnimationFrame(checkProgress);
    };

    animationFrameId = requestAnimationFrame(checkProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [validFeatures]);

  // 모바일 감지
  useEffect(() => {
    const updateMobile = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setIsMobile(!isDesktop);
    };

    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  // PC에서 스크롤 컨테이너 상단 마진을 40px로 설정
  useEffect(() => {
    const updateMargin = () => {
      if (scrollContainerRef.current) {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        scrollContainerRef.current.style.marginTop = isDesktop
          ? "40px"
          : "24px";
      }
    };

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  return (
    <div className={"bg-white"}>
      <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-4"}>
        <div
          className={"py-10 md:py-20 max-desktop:py-10 flex flex-col space-y-4"}
        >
          {/* Featured Partnership with lines */}
          <div
            className={
              "flex items-center justify-center w-full max-w-[1312px] mx-auto"
            }
            style={{ gap: "24px" }}
          >
            <div
              className={"h-0 border-t flex-1"}
              style={{
                borderColor: "#E0E1E5",
                borderWidth: "1px",
              }}
            />
            <p
              className={"text-center align-middle whitespace-nowrap"}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "28px",
                color: "#78797C",
                verticalAlign: "middle",
              }}
            >
              {t("home.partnership.title")}
            </p>
            <div
              className={"h-0 border-t flex-1"}
              style={{
                borderColor: "#E0E1E5",
                borderWidth: "1px",
              }}
            />
          </div>
          <div
            ref={scrollContainerRef}
            className={"overflow-hidden relative w-screen"}
            style={{
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
            }}
          >
            <div
              ref={containerRef}
              className={"flex gap-x-6 animate-partnership-scroll"}
              style={{
                width: "max-content",
              }}
            >
              {features.map((item, i) => {
                const isSquareLogo = item.imagePath.includes(
                  "synergy-ib-investment"
                );
                return (
                  <a
                    key={`featured-${i}`}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    href={item.url}
                    className={
                      "flex-shrink-0 flex items-center justify-center w-[135px] h-[48px] md:w-[180px] md:h-[64px] rounded-2xl bg-white p-[18px] md:p-6 gap-1.5 md:gap-2"
                    }
                    aria-label={`Featured partner ${i + 1}`}
                    style={{
                      borderWidth: isMobile ? "0.75px" : "1px",
                      borderStyle: "solid",
                      borderColor: "rgba(237, 238, 240, 1)",
                    }}
                  >
                    {item.isImage ? (
                      <Image
                        src={item.imagePath}
                        alt={`GOTCAR Featured Partner ${i + 1}`}
                        title={`GOTCAR Featured Partner ${i + 1}`}
                        width={isSquareLogo ? 64 : 180}
                        height={isSquareLogo ? 64 : 64}
                        className={
                          isSquareLogo
                            ? "object-contain"
                            : "w-full h-full object-contain"
                        }
                        style={{
                          filter: item.imagePath.includes("CENTROID")
                            ? "invert(1)"
                            : "none",
                          width: isSquareLogo ? "60px" : undefined,
                          height: isSquareLogo ? "60px" : undefined,
                        }}
                        loading={"lazy"}
                      />
                    ) : (
                      <span
                        className={
                          "text-[#5D5E60] text-sm md:text-base font-medium"
                        }
                        style={{
                          fontFamily: "Pretendard, sans-serif",
                        }}
                      >
                        partner
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
};
