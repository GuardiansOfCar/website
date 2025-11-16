import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "en",
    "zh-CN",
    "ja",
  ],

  defaultLocale: "en",
  
  // v2 base path 설정
  pathnames: {
    "/": "/",
    "/staking": "/staking",
    "/referral": "/referral",
    "/v2/en/staking": "/v2/en/staking",
    "/v2/zh-CN/staking": "/v2/zh-CN/staking",
    "/v2/ja/staking": "/v2/ja/staking",
    "/v2/en/referral": "/v2/en/referral",
    "/v2/zh-CN/referral": "/v2/zh-CN/referral",
    "/v2/ja/referral": "/v2/ja/referral",
  },
});
