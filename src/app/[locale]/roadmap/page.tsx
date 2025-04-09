"use client";

import { RoadmapContainer } from "@/app/[locale]/roadmap/components/container";
import { useTranslations } from "next-intl";

export default function RoadmapPage() {
  const t = useTranslations();
  return (
    <div>
      <RoadmapContainer />
      <div className={"flex flex-col items-center justify-center mt-10"}>
        <p className={"text-body-1b text-neutral-100"}>{t("roadmap.f1")}</p>
        <p className={"text-body-1 text-neutral-100 text-center"}>
          {t("roadmap.g1")}
        </p>
      </div>
    </div>
  );
}
