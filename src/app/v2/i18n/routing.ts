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
  },
});
