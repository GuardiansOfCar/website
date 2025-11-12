"use client";

import { Main } from "@/app/v2/components/main";
import Image from "next/image";

export const ExperienceSection = () => {
  return (
    <div className={"bg-white"}>
      <Main
        leftHref={""}
        rightHref={""}
        hideNav
        horizontalPadding={"px-0 max-desktop:px-5"}
      >
        <section
          className={"flex flex-col space-y-8 py-10"}
          aria-labelledby="experience-heading"
        >
          <header className={"text-center space-y-2"}>
            <h2
              id="experience-heading"
              className={"font-bold text-[40px] leading-[48px] text-center"}
            >
              From Engineering to{" "}
              <span className={"text-sub-primary"}>Experience</span>
            </h2>
            {/* Our Services with lines */}
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
                Our Services
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
          </header>

          <div
            className={"grid grid-cols-3 mt-8"}
            style={{
              gap: "16px",
              width: "1312px",
              maxWidth: "1312px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* Left Column - Top Card */}
            <div
              className={
                "border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative"
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                height: "228px",
                minWidth: "282px",
                borderRadius: "16px",
                padding: "24px",
                gap: "8px",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div
                className={"absolute"}
                style={{ top: "24px", left: "24px", right: "24px" }}
              >
                {/* 아이콘 */}
                <Image
                  src={"/images/g23-3d-icon.png"}
                  alt={
                    "G2E Guardians-To-Earn - Data Contribution Rewards Service Icon"
                  }
                  title={
                    "G2E (Guardians-To-Earn) - Earn tokens by contributing driving data"
                  }
                  width={64}
                  height={64}
                  className={"object-contain"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div style={{ marginTop: "16px" }}>
                  <h3
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "26px",
                      color: "#0F0F0F",
                      marginBottom: "8px",
                    }}
                  >
                    G2E (Guardians-To-Earn)
                  </h3>
                  <p
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: "22px",
                      color: "#5D5E60",
                      verticalAlign: "middle",
                      marginBottom: "8px",
                    }}
                  >
                    Data Contribution Rewards
                  </p>
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
                    Earn tokens by contributing driving data and reporting road
                    risks.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Card - Large */}
            <div
              className={
                "border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col row-span-2 relative"
              }
              style={{
                width: "427px",
                height: "472px",
                minWidth: "283px",
                borderRadius: "16px",
                padding: "24px",
                gap: "8px",
              }}
            >
              {/* 타이틀 - 좌, 상단으로부터 24px 간격 */}
              <h3
                className={"absolute"}
                style={{
                  top: "24px",
                  left: "24px",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "26px",
                  color: "#0F0F0F",
                }}
              >
                AI Risk Alert
              </h3>

              {/* 아이콘 - 카드 bottom으로부터 24px 간격 */}
              <div
                className={"absolute flex items-center justify-center"}
                style={{
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "378px",
                  height: "316px",
                }}
              >
                <Image
                  src={"/images/ai-alert-risk-3d-icon.png"}
                  alt={"AI Risk Alert - Real-time Risk Prediction Service Icon"}
                  title={
                    "AI Risk Alert - Real-time risk prediction for safer driving"
                  }
                  width={378}
                  height={316}
                  className={"object-contain"}
                  loading={"lazy"}
                />
              </div>

              {/* 텍스트 영역 - 타이틀 아래 */}
              <div
                className={"absolute"}
                style={{
                  top: "58px",
                  left: "24px",
                  right: "24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    color: "#5D5E60",
                    verticalAlign: "middle",
                    marginBottom: "8px",
                  }}
                >
                  Real-time Risk Prediction
                </p>
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
                  Detects hazards such as collisions, wrong-way driving, and
                  severe weather conditions.
                </p>
              </div>
            </div>

            {/* Right Column - Top Card */}
            <div
              className={
                "border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative"
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                height: "228px",
                minWidth: "282px",
                borderRadius: "16px",
                padding: "24px",
                gap: "8px",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div
                className={"absolute"}
                style={{ top: "24px", left: "24px", right: "24px" }}
              >
                {/* 아이콘 */}
                <Image
                  src={"/images/precision-parking-3d-icon.png"}
                  alt={
                    "Precision Parking - Indoor Parking Assistance Service Icon"
                  }
                  title={
                    "Precision Parking - Indoor parking navigation and spot detection"
                  }
                  width={64}
                  height={64}
                  className={"object-contain"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div style={{ marginTop: "16px" }}>
                  <h3
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "26px",
                      color: "#0F0F0F",
                      marginBottom: "8px",
                    }}
                  >
                    Precision Parking
                  </h3>
                  <p
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: "22px",
                      color: "#5D5E60",
                      verticalAlign: "middle",
                      marginBottom: "8px",
                    }}
                  >
                    Indoor Parking Assistance
                  </p>
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
                    Tracks vehicle position to locate empty spots and navigate
                    within indoor areas.
                  </p>
                </div>
              </div>
            </div>

            {/* Left Column - Bottom Card */}
            <div
              className={
                "border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative"
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                height: "228px",
                minWidth: "282px",
                borderRadius: "16px",
                padding: "24px",
                gap: "8px",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div
                className={"absolute"}
                style={{ top: "24px", left: "24px", right: "24px" }}
              >
                {/* 아이콘 */}
                <Image
                  src={"/images/smart-payment-3d-icon.png"}
                  alt={"Smart Payment - In-Vehicle Payment Service Icon"}
                  title={
                    "Smart Payment - Seamless in-vehicle payment solutions"
                  }
                  width={64}
                  height={64}
                  className={"object-contain"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div style={{ marginTop: "16px" }}>
                  <h3
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "26px",
                      color: "#0F0F0F",
                      marginBottom: "8px",
                    }}
                  >
                    Smart Payment
                  </h3>
                  <p
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: "22px",
                      color: "#5D5E60",
                      verticalAlign: "middle",
                      marginBottom: "8px",
                    }}
                  >
                    In-Vehicle Payment
                  </p>
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
                    Supports payments for parking, charging, and insurance
                    directly from the car.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Bottom Card */}
            <div
              className={
                "border border-[rgba(237,238,240,1)] bg-[rgba(249,251,251,1)] flex flex-col relative"
              }
              style={{
                width: "100%",
                maxWidth: "426px",
                height: "228px",
                minWidth: "282px",
                borderRadius: "16px",
                padding: "24px",
                gap: "8px",
              }}
            >
              {/* 아이콘과 텍스트 컨테이너 */}
              <div
                className={"absolute"}
                style={{ top: "24px", left: "24px", right: "24px" }}
              >
                {/* 아이콘 */}
                <Image
                  src={"/images/mobility-analytics-3d-icon.png"}
                  alt={"Mobility Analytics - B2B Data Insights Service Icon"}
                  title={
                    "Mobility Analytics - Advanced mobility data analytics for businesses"
                  }
                  width={64}
                  height={64}
                  className={"object-contain"}
                  loading={"lazy"}
                />
                {/* 텍스트 - 아이콘 아래 16px 간격 */}
                <div style={{ marginTop: "16px" }}>
                  <h3
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "26px",
                      color: "#0F0F0F",
                      marginBottom: "8px",
                    }}
                  >
                    Mobility Analytics
                  </h3>
                  <p
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: "22px",
                      color: "#5D5E60",
                      verticalAlign: "middle",
                      marginBottom: "8px",
                    }}
                  >
                    B2B Data Insights
                  </p>
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
                    Provides analytical mobility data services for city
                    planners, traffic agencies, and OEMs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Main>
    </div>
  );
};
