"use client";

import { Main } from "@/components/main";
import { ReferralHistory } from "@/app/[locale]/referral/components/history";
import { CopyrightFooter } from "@/app/v2/components/copyright-footer";

export function ReferralPageClient() {
  return (
    <div>
      <Main leftHref={"/staking"} rightHref={"/g2e"} hideNav={true}>
        <div className={"flex flex-col space-y-8 items-start max-tablet:items-stretch "}>
          <h1 className={"text-header-2 text-primary"}>My Referral Status</h1>
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

