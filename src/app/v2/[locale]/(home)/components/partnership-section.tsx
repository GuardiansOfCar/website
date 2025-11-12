"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FEATURES } from "@/app/v2/lib/constants";
import { useEffect, useMemo, useRef, useState } from "react";

export const PartnershipSection = () => {
    const t = useTranslations();
    const containerRef = useRef<HTMLDivElement>(null);
    const [features, setFeatures] = useState<Array<{ url: string; imageIndex: number }>>([]);

    // 유효한 링크와 해당 이미지 인덱스를 매핑 (메모이제이션하여 무한 루프 방지)
    const validFeatures = useMemo(() => {
        return FEATURES.map((url, index) => ({
            url: url.trim(),
            imageIndex: index + 1,
        })).filter((item) => item.url !== "");
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
                // 188px (이미지 너비) + 24px (gap-x-6 = 1.5rem = 24px)
                const itemWidth = 188 + 24;
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

    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-0 max-desktop:px-5"}>
                <div
                    className={
                        "py-10 max-desktop:py-8 max-desktop:px-0 flex flex-col space-y-4"
                    }
                >
                    {/* Featured Partnership with lines */}
                    <div
                        className={"flex items-center justify-center"}
                        style={{ gap: "24px" }}
                    >
                        <div
                            className={"h-0 border-t"}
                            style={{
                                width: "571px",
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
                            className={"h-0 border-t"}
                            style={{
                                width: "571px",
                                borderColor: "#E0E1E5",
                                borderWidth: "1px",
                            }}
                        />
                    </div>
                    <div className={"overflow-hidden relative w-screen"} style={{ marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)" }}>
                        <div
                            ref={containerRef}
                            className={
                                "flex gap-x-6 animate-partnership-scroll"
                            }
                            style={{
                                width: "max-content",
                            }}
                        >
                            {features.map((item, i) => (
                                <a
                                    key={`featured-${i}`}
                                    target={"_blank"}
                                    rel={"noopener noreferrer"}
                                    href={item.url}
                                    className={"flex-shrink-0"}
                                    aria-label={`Featured partner ${item.imageIndex}`}
                                >
                                    <Image
                                        src={`/images/featured-${item.imageIndex}.png`}
                                        alt={`GOTCAR Featured Partner ${item.imageIndex} - Media Coverage`}
                                        title={`GOTCAR Featured In - Partner ${item.imageIndex}`}
                                        width={188}
                                        height={64}
                                        className={"grayscale"}
                                        loading={"lazy"}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
};

