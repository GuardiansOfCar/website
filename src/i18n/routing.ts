import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: [
    "en",
  //  "ko",
    "ar",
    "tr",
    "de",
    "es",
    "fr",
    "id",
    "it",
    "ja",
    "nl",
    "pt",
    "ru",
    "th",
    "vi",
    "zh",
    "zh-CN",
    "zh-TW",
  ],

  defaultLocale: "en",
});

export const { usePathname, useRouter, redirect, Link } =
  createNavigation(routing);
