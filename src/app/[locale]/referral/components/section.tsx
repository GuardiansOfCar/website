"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";

import clsx, { ClassValue } from "clsx";

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
      <p className={"text-neutral-100 text-[64px] shadow-text"}>{children}</p>
    </section>
  );
};
