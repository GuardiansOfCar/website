"use client";

import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";

export const StakingButton = ({
  className,
  disabled,
  type,
  onClick,
  children,
  backgroundColor = "#21EAF1",
  borderColor = "#00D6DD",
  textColor,
  width,
  height,
}: PropsWithChildren<{
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  onClick?: () => void;
  className?: ClassValue;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  width?: string | number;
  height?: string | number;
}>) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center",
        "rounded-xl",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      style={{
        borderRadius: "12px",
        borderWidth: "1px",
        border: `1px solid ${borderColor}`,
        backgroundColor: backgroundColor,
        opacity: disabled ? 0.5 : 1,
        width: width,
        height: height,
        fontFamily: "Pretendard, sans-serif",
        fontWeight: 700,
        fontSize: "15px",
        lineHeight: "22px",
        textAlign: "center",
        verticalAlign: "middle",
        paddingTop: "15px",
        paddingBottom: "15px",
        color: textColor,
      }}
    >
      {children}
    </button>
  );
};

