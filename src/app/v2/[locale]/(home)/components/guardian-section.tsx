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
      <Main
        leftHref={""}
        rightHref={""}
        hideNav
        horizontalPadding={"px-0 max-desktop:px-5"}
      >
        <div
          className={
            "flex flex-col space-y-8 md:space-y-16 py-6 md:py-10 px-4 md:px-0"
          }
        >
          {/* Be the Guardian — Drive, Earn, Connect. 제목 */}
          <div className={"text-center"}>
            <h2
              className={
                "font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-center text-[#0F0F0F]"
              }
            >
              {parts.map((part, index) =>
                part.toLowerCase() === "guardian" ? (
                  <span key={index} className={"text-sub-primary"}>
                    {part}
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                )
              )}
            </h2>
          </div>

          {/* G2E App with lines */}
          <div
            className={"flex items-center justify-center mt-6 md:mt-12"}
            style={{ gap: "12px" }}
          >
            <div
              className={"h-0 border-t hidden md:block flex-1"}
              style={{
                maxWidth: "571px",
                borderColor: "#E0E1E5",
                borderWidth: "1px",
              }}
            />
            <p
              className={
                "text-center align-middle whitespace-nowrap text-base md:text-[20px] leading-6 md:leading-[28px]"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
                color: "#78797C",
                verticalAlign: "middle",
              }}
            >
              G2E App
            </p>
            <div
              className={"h-0 border-t hidden md:block flex-1"}
              style={{
                maxWidth: "571px",
                borderColor: "#E0E1E5",
                borderWidth: "1px",
              }}
            />
          </div>

          {/* 메인 콘텐츠 영역: 스마트폰 + 설명 텍스트 */}
          <div
            className={
              "flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10"
            }
          >
            {/* 왼쪽: 스마트폰 모형 */}
            <div className={"flex-shrink-0 flex items-center justify-center"}>
              <div
                className={
                  "relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-white w-[180px] h-[373px] md:w-[231.79px] md:h-[480px]"
                }
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
              className={
                "flex flex-col justify-center items-center md:items-start w-full md:w-auto max-w-[500px] px-4 md:px-0"
              }
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
                gap: "8px",
              }}
            >
              <h2
                className={
                  "font-bold text-lg md:text-[24px] leading-7 md:leading-[32px] text-[#00556B] text-center md:text-left"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                Experience the GOTCAR App.
              </h2>
              <p
                className={
                  "font-normal text-sm md:text-[18px] leading-5 md:leading-[26px] text-[#525252] text-center md:text-left"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                Drive, share, and earn in real time.
                <br />
                Every mile you move helps build a connected, decentralized{" "}
                <br />
                mobility ecosystem — and rewards you with tokens.
              </p>
            </div>
          </div>

          {/* 하단 섹션: 3개의 기능 카드 */}
          <div
            className={
              "grid grid-cols-1 md:grid-cols-3 mt-8 md:mt-12 w-full max-w-[1312px] mx-auto gap-4 md:gap-6 px-4 md:px-0"
            }
          >
            {/* Card 1: Drive */}
            <div className={"flex flex-col w-full"}>
              {/* 이미지 영역 */}
              <div
                className={
                  "relative overflow-hidden bg-white w-full aspect-[421/264] rounded-2xl border border-[#EDEEF0]"
                }
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
                className={
                  "bg-white flex flex-col rounded-2xl gap-2 p-4 md:p-6 border border-[#EDEEF0] mt-0"
                }
              >
                <h3
                  className={
                    "text-lg md:text-header-4 text-[#0F0F0F] font-bold"
                  }
                >
                  Drive!
                </h3>
                <p
                  className={
                    "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  Track your trips and gain real-time insights into your driving
                  performance.
                </p>
              </div>
            </div>

            {/* Card 2: Earn */}
            <div className={"flex flex-col w-full"}>
              {/* 이미지 영역 */}
              <div
                className={
                  "relative overflow-hidden bg-white w-full aspect-[421/264] rounded-2xl border border-[#EDEEF0]"
                }
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
                className={
                  "bg-white flex flex-col rounded-2xl gap-2 p-4 md:p-6 border border-[#EDEEF0] mt-0"
                }
              >
                <h3
                  className={
                    "text-lg md:text-header-4 text-[#0F0F0F] font-bold"
                  }
                >
                  Earn!
                </h3>
                <p
                  className={
                    "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  Share your driving data and get rewarded with points you can
                  convert into tokens.
                </p>
              </div>
            </div>

            {/* Card 3: Connect */}
            <div className={"flex flex-col w-full"}>
              {/* 이미지 영역 */}
              <div
                className={
                  "relative overflow-hidden bg-white w-full aspect-[421/264] rounded-2xl border border-[#EDEEF0]"
                }
              >
                <Image
                  src={"/images/connect-3d-icon.png"}
                  alt={
                    "Connect - Decentralized mobility ecosystem connection icon"
                  }
                  title={"Connect - Build a connected mobility ecosystem"}
                  width={421}
                  height={264}
                  className={"object-cover w-full h-full"}
                  loading={"lazy"}
                />
              </div>
              {/* 텍스트 영역 */}
              <div
                className={
                  "bg-white flex flex-col rounded-2xl gap-2 p-4 md:p-6 border border-[#EDEEF0] mt-0"
                }
              >
                <h3
                  className={
                    "text-lg md:text-header-4 text-[#0F0F0F] font-bold"
                  }
                >
                  Connect!
                </h3>
                <p
                  className={
                    "font-normal text-sm md:text-[15px] leading-5 md:leading-[22px] text-[#5D5E60]"
                  }
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  Join the decentralized mobility network where every driver
                  becomes a Guardian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
};
