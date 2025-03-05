import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ko", "ar", "tr"],
  defaultLocale: "en",
});

export const { usePathname, useRouter, redirect, Link } =
  createNavigation(routing);
