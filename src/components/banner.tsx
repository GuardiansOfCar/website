"use client";

import { useTranslations } from "next-intl";

export const Banner = () => {
  const t = useTranslations();
  return (
    <div className={"relative overflow-x-hidden w-full border-primary-80 border-t-4 border-b-4 "}>
      <div
        className={
          "py-[11px] flex space-x-8 animate-marquee"
        }
      >
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <span
              key={index}
              className={"text-body-1b text-neutral-100 whitespace-nowrap"}
            >
              <span className={"text-body-1b text-primary"}>Breaking: </span>
              {t("home.animation1")}
            </span>
          ))}
      </div>
    </div>
  );
};
