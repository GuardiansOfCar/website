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
    <section
      className={"w-full max-desktop:h-auto"}
      style={{
        width: "100%",
        height: "256px",
        minWidth: "212px",
        borderRadius: "16px",
        border: "1px solid #EDEEF0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px",
        backgroundColor: "#F9FBFB",
        opacity: 1,
        boxSizing: "border-box",
      }}
    >
      <div
        className={clsx(headerBorder && "border-b-neutral-60 border-b")}
        style={headerBorder ? { paddingBottom: "12px" } : {}}
      >
        <p
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            lineHeight: "22px",
            verticalAlign: "middle",
            color: "rgba(93, 94, 96, 1)",
          }}
        >
          {title}
        </p>
        <div className={"text-title-1b"}>{description}</div>
      </div>
      <div
        className={"flex flex-col space-y-4 flex-1 justify-between"}
        style={headerBorder ? { paddingTop: "12px" } : { paddingTop: "16px" }}
      >
        {children}
      </div>
    </section>
  );
};
