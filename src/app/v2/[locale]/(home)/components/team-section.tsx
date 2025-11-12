"use client";

import { Main } from "@/app/v2/components/main";
import Image from "next/image";

export const TeamSection = () => {
    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-0 max-desktop:px-5"}>
                <div 
                    className={"flex flex-col space-y-6 md:space-y-8 py-6 md:py-10 w-full max-w-[1312px] mx-auto px-4 md:px-0"}
                >
                    <h2 
                        className={"text-left font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-[#121212]"}
                        style={{
                            fontFamily: "Pretendard, sans-serif",
                        }}
                    >
                        Meet the Team
                    </h2>
                    
                    {/* Introduction Section */}
                    <div className={"flex flex-col md:flex-row gap-6 md:gap-8 items-start"}>
                        <div className={"flex-1 flex flex-col"}>
                            <p
                                className={"font-bold text-lg md:text-[24px] leading-7 md:leading-[32px] text-[#00556B] mb-6 md:mb-[98px]"}
                                style={{
                                    fontFamily: "Pretendard, sans-serif",
                                }}
                            >
                                We are a team of innovators and engineers driving the next era of AI-powered mobility.
                            </p>
                            <p className={"text-body-1 text-[#0F0F0F] text-sm md:text-base"}>
                                With expertise across automotive technology, data intelligence, and blockchain, we are building the foundation for a safer, smarter, and more connected world on the road.
                            </p>
                        </div>
                        <div 
                            className={"flex-shrink-0 relative overflow-hidden w-full md:w-[648px] h-[200px] md:h-[264px] rounded-2xl border border-[rgba(237, 238, 240, 1)]"}
                        >
                            <Image
                                src={"/images/team-section-img.png"}
                                alt={"GOTCAR Team - Innovators and Engineers"}
                                title={"GOTCAR Team - Driving the next era of AI-powered mobility"}
                                width={648}
                                height={264}
                                className={"object-cover w-full h-full"}
                                loading={"lazy"}
                            />
                        </div>
                    </div>

                    {/* Team Members Cards */}
                    <div 
                        className={"flex flex-col md:flex-row mt-6 md:mt-8 gap-4 md:gap-4 w-full"}
                    >
                        {/* Dave Park Card */}
                        <div 
                            className={"flex flex-col md:flex-row w-full md:w-[648px] rounded-2xl gap-4 p-4 border border-[rgba(237, 238, 240, 1)]"}
                        >
                            <div className={"w-full md:w-48 h-48 bg-neutral-80 rounded-lg flex items-center justify-center flex-shrink-0"}>
                                <span className={"text-neutral-60"}>Image</span>
                            </div>
                            <div className={"flex-1 space-y-2"}>
                                <div>
                                    <h3 className={"text-lg md:text-header-4 text-[#0F0F0F] font-bold"}>
                                        Dave Park
                                    </h3>
                                    <p className={"text-sm md:text-body-2 text-[#0F0F0F]"}>
                                        — Founder & CEO
                                    </p>
                                </div>
                                <p className={"text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"}>
                                    Former planner for Connected Car projects at LGU+, Hyundai, and Toyota. Expert in precise positioning technology and smart mobility system design. Serves as a review committee member at the National Land & Transport Data Forum.
                                </p>
                            </div>
                        </div>

                        {/* Jr. Park Card */}
                        <div 
                            className={"flex flex-col md:flex-row w-full md:w-[648px] rounded-2xl gap-4 p-4 border border-[rgba(237, 238, 240, 1)]"}
                        >
                            <div className={"w-full md:w-48 h-48 bg-neutral-80 rounded-lg flex items-center justify-center flex-shrink-0"}>
                                <span className={"text-neutral-60"}>Image</span>
                            </div>
                            <div className={"flex-1 space-y-2"}>
                                <div>
                                    <h3 className={"text-lg md:text-header-4 text-[#0F0F0F] font-bold"}>
                                        Jr. Park
                                    </h3>
                                    <p className={"text-sm md:text-body-2 text-[#0F0F0F]"}>
                                        — Chief Technology Officer (CTO)
                                    </p>
                                </div>
                                <p className={"text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"}>
                                    Ph.D. in Nuclear Engineering from Seoul National University. Specialized in AI-driven CAN data analysis and vehicle positioning correction algorithms. Leads GOTCAR's AI Mobility Agent development and data intelligence strategy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
};

