"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { BorderText } from "@/components/border-text";
import Image from "next/image";
import { FEATURES } from "@/lib/constants";

export const PartnershipSection = () => {
    const t = useTranslations();

    // 유효한 링크와 해당 이미지 인덱스를 매핑
    const validFeatures = FEATURES.map((url, index) => ({
        url: url.trim(),
        imageIndex: index + 1,
    })).filter((item) => item.url !== "");

    // 무한 캐러셀을 위해 목록을 3번 복제 (충분히 긴 애니메이션을 위해)
    const duplicatedFeatures = [...validFeatures, ...validFeatures, ...validFeatures];

    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav>
                <div
                    className={
                        "py-10 max-desktop:py-8 max-desktop:px-0 flex flex-col space-y-4"
                    }
                >
                    <BorderText className={"text-[24px]/[32px] text-center"}>
                        {t("home.partnership.title") || "Featured In"}
                    </BorderText>
                    <div className={"overflow-hidden relative w-full"}>
                        <div
                            className={
                                "flex gap-x-6 gap-y-4 animate-partnership-scroll"
                            }
                        >
                            {duplicatedFeatures.map((item, i) => (
                                <a
                                    key={`featured-${i}`}
                                    target={"_blank"}
                                    href={item.url}
                                    className={"flex-shrink-0"}
                                >
                                    <Image
                                        src={`/images/featured-${item.imageIndex}.png`}
                                        alt={`featured-${item.imageIndex}`}
                                        width={188}
                                        height={64}
                                        className={"grayscale"}
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

