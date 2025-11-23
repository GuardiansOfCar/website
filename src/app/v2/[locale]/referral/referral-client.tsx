"use client";

import { Main } from "@/app/v2/components/main";
import { ReferralHistory } from "@/app/v2/[locale]/referral/components/history";
import { CopyrightFooter } from "@/app/v2/components/copyright-footer";

export function ReferralPageClient() {
  return (
    <div>
      <Main
        leftHref={"/staking"}
        rightHref={"/g2e"}
        hideNav={true}
        horizontalPadding="px-0 max-laptop:px-4"
      >
        <div
          className={
            "flex flex-col items-center max-laptop:mt-[80px] w-[1312px] max-w-[1312px] max-desktop:w-full max-laptop:w-full max-laptop:max-w-full mx-auto"
          }
          style={{
            marginTop: "120px",
          }}
        >
          <div
            className={
              "flex flex-col space-y-4 max-laptop:space-y-4 items-center w-full mb-8 md:mb-12"
            }
          >
            <h1
              className={
                "text-center w-full text-[40px] leading-[48px] max-laptop:text-[24px] max-laptop:leading-[32px]"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
                textAlign: "center",
                color: "#0F0F0F",
              }}
            >
              My Invitations
            </h1>
          </div>

          <ReferralHistory />
        </div>
      </Main>
      <div
        className={"w-full flex justify-center"}
        style={{
          paddingTop: "40px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <CopyrightFooter />
      </div>
    </div>
  );
}
