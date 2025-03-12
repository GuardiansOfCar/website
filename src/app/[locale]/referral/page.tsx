"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { ReferralSection } from "@/app/[locale]/referral/components/section";
import { ReferralHistory } from "@/app/[locale]/referral/components/history";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

export default function ReferralPage() {
  const t = useTranslations();
  const [rate, setRate] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/v1/rewards/list`)
      .then((res) => res.json())
      .then((result) => {
        setRate(
          result.data
            .filter((x: any) => x.type === "REF")
            .reduce((a: any, b: any) => a + b.rate, 0.0) || 0,
        );
      });
  }, []);

  return (
    <Main leftHref={"/staking"} rightHref={"/g2e"}>
      <h2 className={"text-header-2 text-primary mx-10 mb-4"}>
        {t("referral.b1", { 0: rate })}
      </h2>

      <div className={"flex flex-col space-y-8 items-start px-10"}>
        <ReferralSection title={t("referral.c1")}>{rate}%</ReferralSection>
        <ReferralHistory />
      </div>
    </Main>
  );
}
