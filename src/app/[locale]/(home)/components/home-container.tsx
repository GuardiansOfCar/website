"use client";

import { BuyGoCar } from "@/components/buy-go-car";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";
import { Main } from "@/components/main";
import { BorderText } from "@/components/border-text";
import { FEATURES } from "@/lib/constants";
import { RoadmapContainer } from "@/app/[locale]/roadmap/components/container";
import { G2EContainer } from "@/app/[locale]/g2e/components/container";
import { FaqContainer } from "@/app/[locale]/faq/components/container";

export const HomeContainer = () => {
    const t = useTranslations();

    return (
        <>
            <div>
                <div className={"relative flex flex-col"}>
                    <Main leftHref={""} rightHref={"/chapters"}>
                        <div
                            className={
                                "grid grid-cols-3 gap-6 items-start w-full mx-auto max-desktop:flex max-desktop:flex-col max-desktop:items-stretch"
                            }
                        >
                            <BuyGoCar rewards />

                            <div
                                className={
                                    "flex gap-6 col-span-2 max-desktop:flex-col-reverse relative max-desktop:items-center"
                                }
                            >
                                <div className={"flex-1 flex flex-col space-y-4 "}>
                                    <div className={"relative pl-8 flex items-center"}>
                                        <Image
                                            src={"/images/gocar-coin.png"}
                                            alt={"gocar"}
                                            width={68}
                                            height={62}
                                            className={"absolute left-0"}
                                        />
                                        <div
                                            className={
                                                "ml-4 pl-6 border-neutral-0 border-4 py-[15px] w-full bg-neutral-100 flex items-center justify-center"
                                            }
                                        >
                                            <p className={"text-title-1 font-bold text-neutral-0"}>
                                                {t("home.intro1")}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            "border-neutral-0 border-4 py-8 px-6 text-body-3 bg-neutral-100 "
                                        }
                                    >
                                        <span>{t("home.intro2")}</span>
                                        <span>{t("home.intro3")}</span>
                                        <span>{t("home.intro4")}</span>
                                        <span>{t("home.intro5")}</span>
                                        <span>{t("home.intro6")}</span>

                                        <div
                                            className={"text-body-1b flex flex-col space-y-3 pt-3"}
                                        >
                                            <div className={"flex items-center gap-x-2 "}>
                                                <Image
                                                    src={"/images/gear.png"}
                                                    alt={"gear"}
                                                    width={24}
                                                    height={24}
                                                />
                                                {t("home.intro7")}
                                            </div>
                                            <div className={"flex items-center gap-x-2 "}>
                                                <Image
                                                    src={"/images/gear.png"}
                                                    alt={"gear"}
                                                    width={24}
                                                    height={24}
                                                />
                                                {t("home.intro8")}
                                            </div>
                                            <div className={"flex items-center gap-x-2 "}>
                                                <Image
                                                    src={"/images/gear.png"}
                                                    alt={"gear"}
                                                    width={24}
                                                    height={24}
                                                />
                                                {t("home.intro9")}
                                            </div>
                                            <div className={"flex items-center gap-x-2 "}>
                                                <Image
                                                    src={"/images/gear.png"}
                                                    alt={"gear"}
                                                    width={24}
                                                    height={24}
                                                />
                                                {t("home.intro10")}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className={"!text-header-3 !cursor-default"}
                                        size={"lg"}
                                    >
                                        {t("home.intro11")}
                                    </Button>
                                </div>

                                <div
                                    className={
                                        "flex-1 relative overflow-visible  flex flex-col max-desktop:items-center  "
                                    }
                                >
                                    <div
                                        className={
                                            "w-[550px] h-[443px] absolute -translate-x-10 max-desktop:relative max-desktop:!translate-x-0 max-desktop:w-[353px] max-desktop:h-[260px]"
                                        }
                                    >
                                        <Image
                                            src={"/images/actor.gif"}
                                            alt={"actor"}
                                            fill
                                            className={"object-contain"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                "py-10 max-desktop:py-8 max-desktop:px-0 flex flex-col space-y-4"
                            }
                        >
                            <BorderText className={"text-[24px]/[32px]"}>
                                Featured In
                            </BorderText>
                            <div
                                className={
                                    "grid gap-x-6 gap-y-4 grid-cols-6 max-desktop:gap-x-4 max-desktop:grid-cols-4 max-tablet:grid-cols-2"
                                }
                            >
                                {FEATURES.map((x, i) => (
                                    <a key={`featured-${i + 1}`} target={"_blank"} href={x}>
                                        <Image
                                            src={`/images/featured-${i + 1}.png`}
                                            alt={`featured-${i + 1}`}
                                            width={188}
                                            height={64}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Main>

                    <div className={"z-[2] bottom-0 absolute left-0 right-0"}>
                        <div className={"w-full max-w-[var(--max-width)] mx-auto relative"}>
                            <Image
                                className={"absolute bottom-0 w-full h-auto z-[1]"}
                                src={"/images/main-bg.gif"}
                                alt={"gif"}
                                objectFit={"cover"}
                                width={0}
                                sizes={"100vw"}
                                height={0}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={"hidden max-desktop:flex flex-col"}>
                <RoadmapContainer />
                <G2EContainer />
                <FaqContainer hideBuy />
            </div>

            <div className={"flex flex-col items-center justify-center mt-10"}>
                <p className={"text-body-1b text-neutral-100"}>{t("roadmap.f1")}</p>
                <p className={"text-body-1 text-neutral-100 text-center"}>
                    {t("roadmap.g1")}
                </p>
            </div>
        </>
    );
}