"use client";

import { Main } from "@/app/v2/components/main";
import Image from "next/image";

export const TeamSection = () => {
    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-0 max-desktop:px-5"}>
                <div 
                    className={"flex flex-col space-y-8 py-10"}
                    style={{
                        width: "1312px",
                        maxWidth: "1312px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <h2 
                        className={"text-left"}
                        style={{
                            fontFamily: "Pretendard, sans-serif",
                            fontWeight: 700,
                            fontSize: "40px",
                            lineHeight: "48px",
                            color: "#121212",
                            verticalAlign: "middle",
                        }}
                    >
                        Meet the Team
                    </h2>
                    
                    {/* Introduction Section */}
                    <div className={"flex flex-col md:flex-row gap-8 items-start"}>
                        <div className={"flex-1 flex flex-col"}>
                            <p
                                style={{
                                    fontFamily: "Pretendard, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                    color: "#00556B",
                                    verticalAlign: "middle",
                                    marginBottom: "98px",
                                }}
                            >
                                We are a team of innovators and engineers driving the next era of AI-powered mobility.
                            </p>
                            <p className={"text-body-1 text-[#0F0F0F]"}>
                                With expertise across automotive technology, data intelligence, and blockchain, we are building the foundation for a safer, smarter, and more connected world on the road.
                            </p>
                        </div>
                        <div 
                            className={"flex-shrink-0 relative overflow-hidden"}
                            style={{
                                width: "648px",
                                height: "264px",
                                minWidth: "441px",
                                borderRadius: "16px",
                                borderWidth: "1px",
                                border: "1px solid rgba(237, 238, 240, 1)",
                            }}
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
                        className={"flex mt-8"}
                        style={{
                            width: "1312px",
                            height: "238px",
                            gap: "16px",
                        }}
                    >
                        {/* Dave Park Card */}
                        <div 
                            className={"flex flex-col md:flex-row"}
                            style={{
                                width: "648px",
                                height: "238px",
                                minWidth: "556px",
                                borderRadius: "16px",
                                gap: "16px",
                                padding: "16px",
                                border: "1px solid rgba(237, 238, 240, 1)",
                            }}
                        >
                            <div className={"w-full md:w-48 h-48 bg-neutral-80 rounded-lg flex items-center justify-center flex-shrink-0"}>
                                <span className={"text-neutral-60"}>Image</span>
                            </div>
                            <div className={"flex-1 space-y-2"}>
                                <div>
                                    <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>
                                        Dave Park
                                    </h3>
                                    <p className={"text-body-2 text-[#0F0F0F]"}>
                                        — Founder & CEO
                                    </p>
                                </div>
                                <p className={"text-body-3 text-[#0F0F0F]"}>
                                    Former planner for Connected Car projects at LGU+, Hyundai, and Toyota. Expert in precise positioning technology and smart mobility system design. Serves as a review committee member at the National Land & Transport Data Forum.
                                </p>
                            </div>
                        </div>

                        {/* Jr. Park Card */}
                        <div 
                            className={"flex flex-col md:flex-row"}
                            style={{
                                width: "648px",
                                height: "238px",
                                minWidth: "556px",
                                borderRadius: "16px",
                                gap: "16px",
                                padding: "16px",
                                border: "1px solid rgba(237, 238, 240, 1)",
                            }}
                        >
                            <div className={"w-full md:w-48 h-48 bg-neutral-80 rounded-lg flex items-center justify-center flex-shrink-0"}>
                                <span className={"text-neutral-60"}>Image</span>
                            </div>
                            <div className={"flex-1 space-y-2"}>
                                <div>
                                    <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>
                                        Jr. Park
                                    </h3>
                                    <p className={"text-body-2 text-[#0F0F0F]"}>
                                        — Chief Technology Officer (CTO)
                                    </p>
                                </div>
                                <p className={"text-body-3 text-[#0F0F0F]"}>
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

