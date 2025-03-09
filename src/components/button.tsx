"use client";

import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";

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
        "shadow-text",
        "bg-primary border-neutral-0 border-4 text-neutral-100 text-title-1 px-3 text-center flex items-center justify-center",
        "disabled:!bg-[#8D8D8D]",
        size === "sm" && "h-[49px]",
        size === "md" && "h-[56px]",
        size === "lg" && "h-[64px]",
        className,
      )}
    >
      {children}
    </button>
  );
};
