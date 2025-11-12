"use client";

import { Main } from "@/components/main";
import { ReferralHistory } from "@/app/[locale]/referral/components/history";

export function ReferralPageClient() {
  return (
    <div className={"bg-hero"}>
      <Main leftHref={"/staking"} rightHref={"/g2e"}>
        <div className={"flex flex-col space-y-8 items-start max-tablet:items-stretch "}>
          <h1 className={"text-header-2 text-primary"}>My Referral Status</h1>
          <ReferralHistory />
        </div>
      </Main>
    </div>
  );
}

