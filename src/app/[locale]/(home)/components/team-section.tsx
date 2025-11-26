"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const TeamSection = () => {
  const t = useTranslations();
  return (
    <div className={"bg-white"}>
      <Main leftHref={""} rightHref={""} hideNav horizontalPadding={"px-4"}>
        <div
          className={
            "flex flex-col space-y-6 md:space-y-8 mb-10 md:py-10 w-full max-w-[1312px] mx-auto"
          }
        >
          <h2
            className={
              "text-left font-bold text-2xl md:text-[40px] leading-tight md:leading-[48px] text-[#121212]"
            }
            style={{
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            {t("home.team.title")}
          </h2>

          {/* Introduction Section */}
          <div
            className={"flex flex-col md:flex-row gap-4 md:gap-8 items-start"}
          >
            {/* 모바일에서 이미지를 먼저 표시 */}
            <div
              className={
                "flex-shrink-0 relative overflow-hidden w-full md:w-[648px] h-[200px] md:h-[264px] rounded-2xl border border-[rgba(237, 238, 240, 1)] order-1 md:order-3 mt-0"
              }
            >
              <Image
                src={"/images/team-section-img.png"}
                alt={"GOTCAR Team - Innovators and Engineers"}
                title={
                  "GOTCAR Team - Driving the next era of AI-powered mobility"
                }
                width={648}
                height={264}
                className={"object-cover w-full h-full"}
                loading={"lazy"}
              />
            </div>
            <div className={"flex-1 flex flex-col order-2 md:order-2"}>
              <p
                className={
                  "text-[24px] leading-[32px] text-[#00556B] mb-4 md:mb-[98px]"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                }}
              >
                {t("home.team.intro1")}
              </p>
              <p
                className={
                  "text-[18px] md:text-[17px] leading-[26px] text-[#525252]"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 400,
                }}
              >
                {t("home.team.intro2")}
              </p>
            </div>
          </div>

          {/* Team Members Cards */}
          <div
            className={
              "flex flex-col md:flex-row mt-6 md:mt-8 gap-4 md:gap-4 w-full"
            }
          >
            {/* Dave Park Card */}
            <div
              className={
                "flex flex-col md:flex-row w-full md:w-[648px] rounded-2xl gap-4 p-4 border border-[rgba(237, 238, 240, 1)]"
              }
            >
              <div
                className={
                  "w-[120px] h-[120px] md:w-48 md:h-48 rounded-xl md:rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                }
                style={{
                  maxWidth: "120px",
                  maxHeight: "120px",
                }}
              >
                <Image
                  src={"/images/gotcar-ceo.png"}
                  alt={"Dave Park - Founder & CEO"}
                  title={"Dave Park - Founder & CEO"}
                  width={192}
                  height={192}
                  className={"object-cover w-full h-full"}
                  loading={"lazy"}
                />
              </div>
              <div
                className={"flex-1 space-y-2"}
                style={{ paddingLeft: "8px" }}
              >
                <div>
                  <h3
                    className={"text-[20px] leading-[28px] text-[#0F0F0F]"}
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {t("home.team.ceo.name")}
                  </h3>
                  <p
                    className={"text-[15px] leading-[22px] text-[#0082A2]"}
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {t("home.team.ceo.role")}
                  </p>
                </div>
                <div className={"flex flex-col"}>
                  <div className={"flex gap-2"}>
                    <span className={"flex-shrink-0"}>·</span>
                    <span
                      className={
                        "text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"
                      }
                    >
                      {t("home.team.ceo.desc1")}
                    </span>
                  </div>
                  <div className={"flex gap-2"}>
                    <span className={"flex-shrink-0"}>·</span>
                    <span
                      className={
                        "text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"
                      }
                    >
                      {t("home.team.ceo.desc2")}
                    </span>
                  </div>
                  <div className={"flex gap-2"}>
                    <span className={"flex-shrink-0"}>·</span>
                    <span
                      className={
                        "text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"
                      }
                    >
                      {t("home.team.ceo.desc3")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Jr. Park Card */}
            <div
              className={
                "flex flex-col md:flex-row w-full md:w-[648px] rounded-2xl gap-4 p-4 border border-[rgba(237, 238, 240, 1)]"
              }
            >
              <div
                className={
                  "w-[120px] h-[120px] md:w-48 md:h-48 rounded-xl md:rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                }
                style={{
                  maxWidth: "120px",
                  maxHeight: "120px",
                }}
              >
                <Image
                  src={"/images/gotcar-cto.png"}
                  alt={"Jr. Park - Chief Technology Officer"}
                  title={"Jr. Park - Chief Technology Officer"}
                  width={192}
                  height={192}
                  className={"object-cover w-full h-full"}
                  loading={"lazy"}
                />
              </div>
              <div
                className={"flex-1 space-y-2"}
                style={{ paddingLeft: "8px" }}
              >
                <div>
                  <h3
                    className={"text-[20px] leading-[28px] text-[#0F0F0F]"}
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {t("home.team.cto.name")}
                  </h3>
                  <p
                    className={"text-[15px] leading-[22px] text-[#0082A2]"}
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {t("home.team.cto.role")}
                  </p>
                </div>
                <div className={"flex flex-col"}>
                  <div className={"flex gap-2"}>
                    <span className={"flex-shrink-0"}>·</span>
                    <span
                      className={
                        "text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"
                      }
                    >
                      {t("home.team.cto.desc1")}
                    </span>
                  </div>
                  <div className={"flex gap-2"}>
                    <span className={"flex-shrink-0"}>·</span>
                    <span
                      className={
                        "text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"
                      }
                    >
                      {t("home.team.cto.desc2")}
                    </span>
                  </div>
                  <div className={"flex gap-2"}>
                    <span className={"flex-shrink-0"}>·</span>
                    <span
                      className={
                        "text-sm md:text-body-3 text-[#0F0F0F] leading-5 md:leading-6"
                      }
                    >
                      {t("home.team.cto.desc3")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
};
