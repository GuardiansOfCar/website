"use client";

import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { BorderText } from "@/app/v2/components/border-text";

export const Button = ({
  size = "md",
  className,
  disabled,
  type,
  onClick,
  children,
}: PropsWithChildren<{
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  onClick?: () => void;
  className?: ClassValue;
  size?: "sm" | "md" | "lg";
}>) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center",
        "bg-primary border-neutral-0 border-4  px-3",
        "disabled:!bg-[#8D8D8D]",
        size === "sm" && "h-[49px]",
        size === "md" && "h-[56px]",
        size === "lg" && "h-[64px]",
        className,
      )}
    >
      <BorderText className={"text-title-1 translate-y-0.5 font-[700]"}>
        {children as string}
      </BorderText>
    </button>
  );
};
