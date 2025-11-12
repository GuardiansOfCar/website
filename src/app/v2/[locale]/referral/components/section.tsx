"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";

import clsx, { ClassValue } from "clsx";
import { BorderText } from "@/components/border-text";

export const ReferralSection = ({
  title,
  children,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <section
      className={
        " pt-5 pb-1 px-9 flex flex-col items-center justify-center border-neutral-0 border-4 bg-primary"
      }
    >
      <p className={"text-header-3"}>{title}</p>
      <BorderText className={"text-[64px]/[64px] font-[700]"}>
        {children as string}
      </BorderText>
    </section>
  );
};
