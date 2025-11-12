"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export default function ChapterLayout({ children }: { children: ReactNode }) {
  const t = useTranslations();
  return (
    <div className={"bg-hero"}>
      {children}
      <div className={"flex flex-col items-center justify-start mt-10 mx-5 z-[10] relative"}>
        <p className={"text-body-1b text-neutral-100"}>
          {t("chapter.disclaimer")}
        </p>
        <p className={"text-body-1 text-neutral-100"}>
          {t("chapter.disclaimerT1")}
        </p>
      </div>
    </div>
  );
}
