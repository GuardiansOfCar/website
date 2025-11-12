"use client";

import { Main } from "@/components/main";

export const TeamSection = () => {
    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav>
                <div className={"flex flex-col space-y-8 py-10"}>
                    <h2 className={"text-header-2 text-[#0F0F0F] text-center"}>
                        Meet the Team
                    </h2>
                    
                    {/* Introduction Section */}
                    <div className={"flex flex-col md:flex-row gap-8 items-start"}>
                        <div className={"flex-1 space-y-4"}>
                            <p className={"text-body-1b text-[#0F0F0F] font-bold"}>
                                We are a team of innovators and engineers driving the next era of AI-powered mobility.
                            </p>
                            <p className={"text-body-1 text-[#0F0F0F]"}>
                                With expertise across automotive technology, data intelligence, and blockchain, we are building the foundation for a safer, smarter, and more connected world on the road.
                            </p>
                        </div>
                        <div className={"w-full md:w-64 h-48 bg-neutral-80 rounded-lg flex items-center justify-center flex-shrink-0"}>
                            <span className={"text-neutral-60"}>Image</span>
                        </div>
                    </div>

                    {/* Team Members */}
                    <div className={"flex flex-col space-y-8 mt-8"}>
                        {/* Dave Park */}
                        <div className={"flex flex-col md:flex-row gap-6"}>
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

                        {/* Jr. Park */}
                        <div className={"flex flex-col md:flex-row gap-6"}>
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

