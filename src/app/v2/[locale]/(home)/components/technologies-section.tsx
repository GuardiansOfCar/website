"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";

export const TechnologiesSection = () => {
    const t = useTranslations();

    return (
        <div className={"bg-[#030711]"}>
            <Main leftHref={""} rightHref={""} hideNav>
                <section className={"flex flex-col space-y-12 py-16"} aria-labelledby="technologies-heading">
                    <header className={"text-center flex flex-col items-center space-y-4"}>
                        <h2 id="technologies-heading" className={"text-[32px] leading-[40px] font-bold"}>
                            <span className={"text-neutral-100"}>Engineering the </span>
                            <span 
                                className={"inline-block"}
                                style={{
                                    background: "radial-gradient(ellipse 134.33% 152.08% at 0.16% -11.46%, #007F83 0%, #21EAF1 58.65%, #007F83 100%)",
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
                        <div className={"bg-[#121A26] rounded-lg p-6 flex flex-col space-y-4 pb-8"}>
                            <div className={"w-16 h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"}>
                                {/* 아이콘 공간 - 픽토그램 이미지가 들어갈 자리 */}
                                <div className={"w-12 h-12 bg-[#00C8C8]/10 rounded flex items-center justify-center"}>
                                    <span className={"text-[#00C8C8] text-xs"}>Icon</span>
                                </div>
                            </div>
                            <h3 className={"font-bold text-[40px] leading-[48px] text-neutral-100"}>
                                Precision Positioning AI Engine
                            </h3>
                            <p className={"text-[14px] leading-[22px] text-neutral-100 font-normal mt-auto"}>
                                Tracks your exact location with sub-meter accuracy, even inside tunnels or underground parking areas — making lane-level navigation possible.
                            </p>
                        </div>
                        
                        {/* Card 2: Mobility Data Blockchain */}
                        <div className={"bg-[#121A26] rounded-lg p-6 flex flex-col space-y-4 pb-8"}>
                            <div className={"w-16 h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"}>
                                {/* 아이콘 공간 - 픽토그램 이미지가 들어갈 자리 */}
                                <div className={"w-12 h-12 bg-[#00C8C8]/10 rounded flex items-center justify-center"}>
                                    <span className={"text-[#00C8C8] text-xs"}>Icon</span>
                                </div>
                            </div>
                            <h3 className={"font-bold text-[40px] leading-[48px] text-neutral-100"}>
                                Mobility Data Blockchain
                            </h3>
                            <p className={"text-[14px] leading-[22px] text-neutral-100 font-normal mt-auto"}>
                                Uses blockchain to securely share driving data while keeping it anonymous — ensuring transparency and trust across the network.
                            </p>
                        </div>
                        
                        {/* Card 3: AI Mobility Agent */}
                        <div className={"bg-[#121A26] rounded-lg p-6 flex flex-col space-y-4 pb-8"}>
                            <div className={"w-16 h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"}>
                                {/* 아이콘 공간 - 픽토그램 이미지가 들어갈 자리 */}
                                <div className={"w-12 h-12 bg-[#00C8C8]/10 rounded flex items-center justify-center"}>
                                    <span className={"text-[#00C8C8] text-xs"}>Icon</span>
                                </div>
                            </div>
                            <h3 className={"font-bold text-[40px] leading-[48px] text-neutral-100"}>
                                AI Mobility Agent
                            </h3>
                            <p className={"text-[14px] leading-[22px] text-neutral-100 font-normal mt-auto"}>
                                Analyzes driving behavior and road conditions to predict risks in real time and offer smart, personalized guidance for every driver.
                            </p>
                        </div>
                    </div>
                </section>
            </Main>
        </div>
    );
};

