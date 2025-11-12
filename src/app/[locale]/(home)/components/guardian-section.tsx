"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const GuardianSection = () => {
    const t = useTranslations();
    const title = t("home.guardian.title") || "Be the Guardian — Drive, Earn, Connect.";
    
    // "Guardian" 단어를 찾아서 분리
    const parts = title.split(/(Guardian)/i);
    
    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav>
                <div className={"flex flex-col space-y-16 py-10"}>
                    {/* Be the Guardian — Drive, Earn, Connect. 제목 */}
                    <div className={"text-center"}>
                        <h2 className={"font-bold text-[40px] leading-[48px] text-center text-[#0F0F0F]"}>
                            {parts.map((part, index) => 
                                part.toLowerCase() === "guardian" ? (
                                    <span key={index} className={"text-primary"}>{part}</span>
                                ) : (
                                    <span key={index}>{part}</span>
                                )
                            )}
                        </h2>
                    </div>
                    
                    {/* 상단 섹션: G2E App 헤더 */}
                    <div className={"text-center"}>
                        <p className={"text-body-1 text-neutral-60"}>G2E App</p>
                    </div>
                    
                    {/* 메인 콘텐츠 영역: 스마트폰 + 설명 텍스트 */}
                    <div className={"flex flex-col md:flex-row items-center gap-12"}>
                        {/* 왼쪽: 스마트폰 모형 */}
                        <div className={"w-full md:w-[300px] flex-shrink-0 flex items-center justify-center"}>
                            <div className={"w-[280px] h-[560px] bg-black rounded-[40px] p-4 shadow-2xl"}>
                                <div className={"w-full h-full bg-white rounded-[32px] overflow-hidden relative"}>
                                    <video
                                        autoPlay={true}
                                        loop
                                        playsInline
                                        controls={false}
                                        muted
                                        className={"w-full h-full object-cover"}
                                    >
                                        <source src="/videos/g2e.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                        
                        {/* 오른쪽: 설명 텍스트 */}
                        <div className={"flex-1 flex flex-col justify-center space-y-4"}>
                            <h2 className={"text-[32px] leading-[40px] font-bold text-primary"}>
                                Experience the GOTCAR App.
                            </h2>
                            <p className={"text-body-1 text-neutral-60 max-w-lg"}>
                                Drive, share, and earn in real time. Every mile you move helps build a connected, decentralized mobility ecosystem — and rewards you with tokens.
                            </p>
                        </div>
                    </div>
                    
                    {/* 하단 섹션: 3개의 기능 카드 */}
                    <div className={"grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"}>
                        {/* Card 1: Drive */}
                        <div className={"bg-white rounded-2xl border border-[rgba(237,238,240,1)] p-6 flex flex-col space-y-4"}>
                            <div className={"w-full h-48 bg-neutral-80 rounded-lg flex items-center justify-center"}>
                                <span className={"text-neutral-60 text-sm"}>Drive Image</span>
                            </div>
                            <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>Drive</h3>
                            <p className={"text-body-3 text-neutral-60"}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        
                        {/* Card 2: Earn */}
                        <div className={"bg-white rounded-2xl border border-[rgba(237,238,240,1)] p-6 flex flex-col space-y-4"}>
                            <div className={"w-full h-48 bg-neutral-80 rounded-lg flex items-center justify-center"}>
                                <span className={"text-neutral-60 text-sm"}>Earn Image</span>
                            </div>
                            <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>Earn</h3>
                            <p className={"text-body-3 text-neutral-60"}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        
                        {/* Card 3: Connect */}
                        <div className={"bg-white rounded-2xl border border-[rgba(237,238,240,1)] p-6 flex flex-col space-y-4"}>
                            <div className={"w-full h-48 bg-neutral-80 rounded-lg flex items-center justify-center"}>
                                <span className={"text-neutral-60 text-sm"}>Connect Image</span>
                            </div>
                            <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>Connect</h3>
                            <p className={"text-body-3 text-neutral-60"}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
};

