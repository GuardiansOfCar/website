"use client";

import {BuyGoCar} from "@/components/buy-go-car";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Button} from "@/components/button";
import {Main} from "@/components/main";

export default function Home() {
    const t = useTranslations();
    /* <div className={"absolute left-0 right-0 bottom-0 top-0 z-[1]"}><Image src={"/images/hero.png"} alt={"hero"}
                                                                              sizes="100vw" width={0} height={0} fill
                                                                              style={{objectFit: "cover",}}/></div>*/
    return (
        <>
            <Main leftHref={""} rightHref={"/chapters"}>
                <div className={"py-10 pl-14 flex items-center"}>
                    <div className={"flex space-x-6 items-start"}>
                        <BuyGoCar rewards/>
                        <div className={"flex flex-col space-y-4 w-[400px]"}>
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

                                <div className={"text-body-1b flex flex-col space-y-3 pt-3"}>
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

                            <Button className={"!text-header-3"} size={"lg"} disabled>
                                {t("home.intro11")}
                            </Button>
                        </div>
                    </div>

                    <Image
                        className={"absolute right-0"}
                        src={"/images/actor.png"}
                        alt={"actor"}
                        width={664}
                        height={664}
                    />
                </div>

                <Image src={"/images/cs.png"} alt={"cs"} width={1250} className="mx-auto" height={320}/>
            </Main>
        </>
    );
}
