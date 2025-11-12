"use client";

import { Main } from "@/components/main";

export const ExperienceSection = () => {
    return (
        <div className={"bg-white"}>
                    <Main leftHref={""} rightHref={""} hideNav>
                        <section className={"flex flex-col space-y-8 py-10"} aria-labelledby="experience-heading">
                            <header className={"text-center space-y-2"}>
                                <h2 id="experience-heading" className={"font-bold text-[40px] leading-[48px] text-center"}>
                                    From Engineering to{" "}
                                    <span className={"text-primary"}>Experience</span>
                                </h2>
                                <p className={"text-body-1 text-neutral-100"}>
                                    -Our Services
                                </p>
                            </header>
                    
                    <div className={"grid grid-cols-3 gap-6 mt-8"}>
                        {/* Left Column - Top Card */}
                        <div className={"border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] rounded-2xl p-6 flex flex-col space-y-4"}>
                            <div className={"flex items-start justify-between gap-4"}>
                                <div className={"flex-1 space-y-2"}>
                                    <h3 className={"text-header-4 text-neutral-100 font-bold"}>
                                        G2E (Guardians-To-Earn)
                                    </h3>
                                    <p className={"text-body-2 text-neutral-100 font-bold"}>
                                        Data Contribution Rewards
                                    </p>
                                    <p className={"text-body-3 text-neutral-100"}>
                                        Earn tokens by contributing driving data and reporting road risks.
                                    </p>
                                </div>
                                <div className={"w-24 h-16 bg-neutral-80 flex items-center justify-center flex-shrink-0"}>
                                    <span className={"text-neutral-60 text-xs"}>픽토그램 이미지</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Card - Large */}
                        <div className={"border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] rounded-2xl p-6 flex flex-col space-y-4 row-span-2"}>
                            <div className={"flex flex-col items-center space-y-4"}>
                                <div className={"w-32 h-32 bg-neutral-80 flex items-center justify-center"}>
                                    <span className={"text-neutral-60 text-xs"}>픽토그램 이미지</span>
                                </div>
                                <div className={"flex-1 space-y-2 text-center"}>
                                    <h3 className={"text-header-4 text-neutral-100 font-bold"}>
                                        AI Risk Alert
                                    </h3>
                                    <p className={"text-body-2 text-neutral-100 font-bold"}>
                                        Real-time Risk Prediction
                                    </p>
                                    <p className={"text-body-3 text-neutral-100"}>
                                        Detects hazards such as collisions, wrong-way driving, and severe weather conditions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Top Card */}
                        <div className={"border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] rounded-2xl p-6 flex flex-col space-y-4"}>
                            <div className={"flex items-start justify-between gap-4"}>
                                <div className={"flex-1 space-y-2"}>
                                    <h3 className={"text-header-4 text-neutral-100 font-bold"}>
                                        Precision Parking
                                    </h3>
                                    <p className={"text-body-2 text-neutral-100 font-bold"}>
                                        Indoor Parking Assistance
                                    </p>
                                    <p className={"text-body-3 text-neutral-100"}>
                                        Tracks vehicle position to locate empty spots and navigate within indoor areas.
                                    </p>
                                </div>
                                <div className={"w-24 h-16 bg-neutral-80 flex items-center justify-center flex-shrink-0"}>
                                    <span className={"text-neutral-60 text-xs"}>픽토그램 이미지</span>
                                </div>
                            </div>
                        </div>

                        {/* Left Column - Bottom Card */}
                        <div className={"border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] rounded-2xl p-6 flex flex-col space-y-4"}>
                            <div className={"flex items-start justify-between gap-4"}>
                                <div className={"flex-1 space-y-2"}>
                                    <h3 className={"text-header-4 text-neutral-100 font-bold"}>
                                        Smart Payment
                                    </h3>
                                    <p className={"text-body-2 text-neutral-100 font-bold"}>
                                        In-Vehicle Payment
                                    </p>
                                    <p className={"text-body-3 text-neutral-100"}>
                                        Supports payments for parking, charging, and insurance directly from the car.
                                    </p>
                                </div>
                                <div className={"w-24 h-16 bg-neutral-80 flex items-center justify-center flex-shrink-0"}>
                                    <span className={"text-neutral-60 text-xs"}>픽토그램 이미지</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Bottom Card */}
                        <div className={"border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] rounded-2xl p-6 flex flex-col space-y-4"}>
                            <div className={"flex items-start justify-between gap-4"}>
                                <div className={"flex-1 space-y-2"}>
                                    <h3 className={"text-header-4 text-neutral-100 font-bold"}>
                                        Mobility Analytics
                                    </h3>
                                    <p className={"text-body-2 text-neutral-100 font-bold"}>
                                        B2B Data Insights
                                    </p>
                                    <p className={"text-body-3 text-neutral-100"}>
                                        Provides analytical mobility data services for city planners, traffic agencies, and OEMs.
                                    </p>
                                </div>
                                <div className={"w-24 h-16 bg-neutral-80 flex items-center justify-center flex-shrink-0"}>
                                    <span className={"text-neutral-60 text-xs"}>픽토그램 이미지</span>
                                </div>
                            </div>
                                </div>
                            </div>
                        </section>
                    </Main>
                </div>
            );
        };

