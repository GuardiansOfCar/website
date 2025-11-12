"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const GuardianSection = () => {
    const t = useTranslations();
    const title = t("home.guardian.title");
    
    // "Guardian" 단어를 찾아서 분리
    const parts = title.split(/(Guardian)/i);
    
    return (
        <div className={"bg-white"}>
            <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-0 max-desktop:px-5"}>
                <div className={"flex flex-col space-y-16 py-10"}>
                    {/* Be the Guardian — Drive, Earn, Connect. 제목 */}
                    <div className={"text-center"}>
                        <h2 className={"font-bold text-[40px] leading-[48px] text-center text-[#0F0F0F]"}>
                            {parts.map((part, index) => 
                                part.toLowerCase() === "guardian" ? (
                                    <span key={index} className={"text-sub-primary"}>{part}</span>
                                ) : (
                                    <span key={index}>{part}</span>
                                )
                            )}
                        </h2>
                    </div>
                    
                    {/* G2E App with lines */}
                    <div
                        className={"flex items-center justify-center"}
                        style={{ gap: "24px", marginTop: "48px" }}
                    >
                        <div
                            className={"h-0 border-t"}
                            style={{
                                width: "571px",
                                borderColor: "#E0E1E5",
                                borderWidth: "1px",
                            }}
                        />
                        <p
                            className={"text-center align-middle whitespace-nowrap"}
                            style={{
                                fontFamily: "Pretendard, sans-serif",
                                fontWeight: 700,
                                fontSize: "20px",
                                lineHeight: "28px",
                                color: "#78797C",
                                verticalAlign: "middle",
                            }}
                        >
                            G2E App
                        </p>
                        <div
                            className={"h-0 border-t"}
                            style={{
                                width: "571px",
                                borderColor: "#E0E1E5",
                                borderWidth: "1px",
                            }}
                        />
                    </div>
                    
                    {/* 메인 콘텐츠 영역: 스마트폰 + 설명 텍스트 */}
                    <div className={"flex flex-col md:flex-row items-center justify-center"} style={{ gap: "40px" }}>
                        {/* 왼쪽: 스마트폰 모형 */}
                        <div className={"flex-shrink-0 flex items-center justify-center"}>
                            <div 
                                className={"relative overflow-hidden rounded-[32px] bg-white"}
                                style={{
                                    width: "231.79px",
                                    height: "480px",
                                }}
                            >
                                <video
                                    autoPlay={true}
                                    loop
                                    playsInline
                                    controls={false}
                                    muted
                                    className={"w-full h-full"}
                                    style={{
                                        objectFit: "cover",
                                    }}
                                >
                                    <source src="/videos/g2e.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                        
                        {/* 오른쪽: 설명 텍스트 */}
                        <div 
                            className={"flex flex-col justify-center items-center md:items-start"}
                            style={{
                                width: "400px",
                                maxWidth: "400px",
                                paddingTop: "12px",
                                paddingBottom: "12px",
                                gap: "8px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "Pretendard, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "32px",
                                    color: "#00556B",
                                    verticalAlign: "middle",
                                }}
                            >
                                Experience the GOTCAR App.
                            </h2>
                            <p
                                style={{
                                    fontFamily: "Pretendard, sans-serif",
                                    fontWeight: 400,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "#525252",
                                    verticalAlign: "middle",
                                }}
                            >
                                Drive, share, and earn in real time. Every mile you move helps build a connected, decentralized mobility ecosystem — and rewards you with tokens.
                            </p>
                        </div>
                    </div>
                    
                    {/* 하단 섹션: 3개의 기능 카드 */}
                    <div 
                        className={"grid grid-cols-1 md:grid-cols-3 mt-12"}
                        style={{
                            gap: "24px",
                            width: "1312px",
                            maxWidth: "1312px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {/* Card 1: Drive */}
                        <div className={"flex flex-col"}>
                            {/* 이미지 영역 */}
                            <div 
                                className={"relative overflow-hidden bg-white"}
                                style={{
                                    width: "421px",
                                    height: "264px",
                                    borderRadius: "16px",
                                    border: "1px solid #EDEEF0",
                                }}
                            >
                                <Image
                                    src={"/images/drive-3d-icon.png"}
                                    alt={"Drive - Real-time driving and mobility service icon"}
                                    title={"Drive - Drive, share, and earn in real time"}
                                    width={421}
                                    height={264}
                                    className={"object-cover w-full h-full"}
                                    loading={"lazy"}
                                />
                            </div>
                            {/* 텍스트 영역 */}
                            <div 
                                className={"bg-white flex flex-col"}
                                style={{
                                    width: "421px",
                                    height: "192px",
                                    borderRadius: "16px",
                                    gap: "8px",
                                    padding: "24px",
                                    border: "1px solid #EDEEF0",
                                    marginTop: "0",
                                }}
                            >
                                <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>Drive</h3>
                                <p
                                    style={{
                                        fontFamily: "Pretendard, sans-serif",
                                        fontWeight: 400,
                                        fontSize: "15px",
                                        lineHeight: "22px",
                                        color: "#5D5E60",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                        </div>
                        
                        {/* Card 2: Earn */}
                        <div className={"flex flex-col"}>
                            {/* 이미지 영역 */}
                            <div 
                                className={"relative overflow-hidden bg-white"}
                                style={{
                                    width: "421px",
                                    height: "264px",
                                    borderRadius: "16px",
                                    border: "1px solid #EDEEF0",
                                }}
                            >
                                <Image
                                    src={"/images/earn-3d-icon.png"}
                                    alt={"Earn - Token rewards and earnings service icon"}
                                    title={"Earn - Earn tokens by driving and sharing"}
                                    width={421}
                                    height={264}
                                    className={"object-cover w-full h-full"}
                                    loading={"lazy"}
                                />
                            </div>
                            {/* 텍스트 영역 */}
                            <div 
                                className={"bg-white flex flex-col"}
                                style={{
                                    width: "421px",
                                    height: "192px",
                                    borderRadius: "16px",
                                    gap: "8px",
                                    padding: "24px",
                                    border: "1px solid #EDEEF0",
                                    marginTop: "0",
                                }}
                            >
                                <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>Earn</h3>
                                <p
                                    style={{
                                        fontFamily: "Pretendard, sans-serif",
                                        fontWeight: 400,
                                        fontSize: "15px",
                                        lineHeight: "22px",
                                        color: "#5D5E60",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                        </div>
                        
                        {/* Card 3: Connect */}
                        <div className={"flex flex-col"}>
                            {/* 이미지 영역 */}
                            <div 
                                className={"relative overflow-hidden bg-white"}
                                style={{
                                    width: "421px",
                                    height: "264px",
                                    borderRadius: "16px",
                                    border: "1px solid #EDEEF0",
                                }}
                            >
                                <Image
                                    src={"/images/connect-3d-icon.png"}
                                    alt={"Connect - Decentralized mobility ecosystem connection icon"}
                                    title={"Connect - Build a connected mobility ecosystem"}
                                    width={421}
                                    height={264}
                                    className={"object-cover w-full h-full"}
                                    loading={"lazy"}
                                />
                            </div>
                            {/* 텍스트 영역 */}
                            <div 
                                className={"bg-white flex flex-col"}
                                style={{
                                    width: "421px",
                                    height: "192px",
                                    borderRadius: "16px",
                                    gap: "8px",
                                    padding: "24px",
                                    border: "1px solid #EDEEF0",
                                    marginTop: "0",
                                }}
                            >
                                <h3 className={"text-header-4 text-[#0F0F0F] font-bold"}>Connect</h3>
                                <p
                                    style={{
                                        fontFamily: "Pretendard, sans-serif",
                                        fontWeight: 400,
                                        fontSize: "15px",
                                        lineHeight: "22px",
                                        color: "#5D5E60",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Main>
        </div>
    );
};

