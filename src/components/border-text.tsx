"use client";

import { PropsWithChildren } from "react";
import clsx, { ClassValue } from "clsx";

export const BorderText = (
  props: PropsWithChildren<{
    size: "sm" | "md" | "lg"|"sm-fw"
  }>,
) => {
  let className = "";
  let viewBox = "";
  switch (props.size) {
    case "sm":
      className = "w-[105px] h-[41px]";
      viewBox = "0 0 105 41";
      break;
    case "sm-fw":
      className = "w-[1248px] h-[41px] max-w-full";
      viewBox = "0 0 1248 41";
      break;
    case "md":
      className = "w-[360px] h-[48px]";
      viewBox = "0 0 360 48";
      break;
    case "lg":
      className = "w-[392px] h-[56px]";
      viewBox = "0 0 392 56";
      break;
  }

  return (
    <svg
      className={clsx(className)}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x={"50%"}
        fontSize={"100%"}
        y={"50%"}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#FCFCFC"
        stroke={"#000000"}
        strokeWidth="3"
        paintOrder="stroke"
      >
        {props.children}
      </text>
    </svg>
  );
};
