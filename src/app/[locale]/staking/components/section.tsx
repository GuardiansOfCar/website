"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";

import clsx, { ClassValue } from "clsx";

export const StakingSection = ({
  title,
  headerBorder,
  children,
  description,
}: {
  headerBorder?: boolean;

  children: ReactNode;
  title: string;
  description: ReactNode;
}) => {
  return (
    <section className={"border-neutral-0 border-4  p-4 flex flex-col bg-neutral-100"}>
      <div
        className={clsx(headerBorder && "border-b-neutral-60 border-b pb-2")}
      >
        <p className={"text-body-3"}>{title}</p>
        <div className={"text-title-1b"}>{description}</div>
      </div>
      <div className={"pt-4 flex flex-col space-y-4"}>{children}</div>
    </section>
  );
};
