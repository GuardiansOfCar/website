
"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";

import clsx, { ClassValue } from "clsx";

export const RoadmapSection = ({
                                 title,
                                 children,
                                 right,
                               }: {
  right?: boolean;
  children: ReactNode;
  title: string;
}) => {
  return (
      <div className={"w-[400px] flex flex-col"}>
        <section
            className={clsx(
                "w-[328px] border-neutral-0 border-4 flex flex-col bg-neutral-100 py-4 px-5 space-y-3",
                right ? "ml-auto" : "mr-auto",
            )}
        >
          <div className={clsx("  flex items-center justify-between ")}>
            <p className={"text-header-4 text-primary-10"}>{title}</p>
          </div>
          <p className={"text-body-3"}>{children}</p>
        </section>
      </div>
  );
};
