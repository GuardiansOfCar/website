"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const TechnologiesSection = () => {
    const t = useTranslations();

    return (
        <div className={"bg-[#030711]"}>
            <Main leftHref={""} rightHref={""} hideNav>
                <section className={"flex flex-col space-y-8 md:space-y-12 py-8 md:py-16"} aria-labelledby="technologies-heading">
                    <header className={"text-center flex flex-col items-center space-y-3 md:space-y-4 px-4"}>
                        <h2 id="technologies-heading" className={"text-xl md:text-[32px] leading-tight md:leading-[40px] font-bold"}>
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
                        <p className={"text-[#00C8C8] text-base md:text-lg font-normal"}>
                            Our Technologies
                        </p>
                    </header>
                    
                    <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"}>
                        {/* Card 1: Precision Positioning AI Engine */}
                        <div className={"bg-[#121A26] rounded-lg p-4 md:p-6 flex flex-col space-y-3 md:space-y-4 pb-6 md:pb-8"}>
                            <div className={"w-12 h-12 md:w-16 md:h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"}>
                                <Image
                                    src={"/images/precision-positioning-ai-engine.png"}
                                    alt={"Precision Positioning AI Engine Icon"}
                                    title={"Precision Positioning AI Engine - Sub-meter accuracy location tracking"}
                                    width={48}
                                    height={48}
                                    className={"object-contain w-8 h-8 md:w-12 md:h-12"}
                                    loading={"lazy"}
                                />
                            </div>
                            <h3 className={"font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-neutral-100"}>
                                Precision Positioning AI Engine
                            </h3>
                            <p className={"text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal mt-auto"}>
                                Tracks your exact location with sub-meter accuracy, even inside tunnels or underground parking areas — making lane-level navigation possible.
                            </p>
                        </div>
                        
                        {/* Card 2: Mobility Data Blockchain */}
                        <div className={"bg-[#121A26] rounded-lg p-4 md:p-6 flex flex-col space-y-3 md:space-y-4 pb-6 md:pb-8"}>
                            <div className={"w-12 h-12 md:w-16 md:h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"}>
                                <Image
                                    src={"/images/mobility-data-blockchain.png"}
                                    alt={"Mobility Data Blockchain Icon"}
                                    title={"Mobility Data Blockchain - Secure and anonymous data sharing"}
                                    width={48}
                                    height={48}
                                    className={"object-contain w-8 h-8 md:w-12 md:h-12"}
                                    loading={"lazy"}
                                />
                            </div>
                            <h3 className={"font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-neutral-100"}>
                                Mobility Data Blockchain
                            </h3>
                            <p className={"text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal mt-auto"}>
                                Uses blockchain to securely share driving data while keeping it anonymous — ensuring transparency and trust across the network.
                            </p>
                        </div>
                        
                        {/* Card 3: AI Mobility Agent */}
                        <div className={"bg-[#121A26] rounded-lg p-4 md:p-6 flex flex-col space-y-3 md:space-y-4 pb-6 md:pb-8"}>
                            <div className={"w-12 h-12 md:w-16 md:h-16 bg-[#121A26] flex items-center justify-center flex-shrink-0 rounded-lg border border-[#00C8C8]/20"}>
                                <Image
                                    src={"/images/ai-mobility-agent.png"}
                                    alt={"AI Mobility Agent Icon"}
                                    title={"AI Mobility Agent - Real-time risk prediction and smart guidance"}
                                    width={48}
                                    height={48}
                                    className={"object-contain w-8 h-8 md:w-12 md:h-12"}
                                    loading={"lazy"}
                                />
                            </div>
                            <h3 className={"font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-neutral-100"}>
                                AI Mobility Agent
                            </h3>
                            <p className={"text-sm md:text-[14px] leading-5 md:leading-[22px] text-neutral-100 font-normal mt-auto"}>
                                Analyzes driving behavior and road conditions to predict risks in real time and offer smart, personalized guidance for every driver.
                            </p>
                        </div>
                    </div>
                </section>
            </Main>
        </div>
    );
};

