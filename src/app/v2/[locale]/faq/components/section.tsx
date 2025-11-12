"use client";

import { ReactNode } from "react";
import Image from "next/image";
import clsx from "clsx";

export const FaqSection = ({
  title,
  children,
  onOpen,
  open,
}: {
  children: ReactNode;
  title: string;
  open: boolean;
  onOpen: (open: boolean) => void;
}) => {
  const handleOpenClick = () => {
    onOpen(!open);
  };

  return (
    <div
      className={clsx(
        "w-full flex flex-col relative transition-all duration-300 rounded-2xl",
        "p-4 md:p-8",
        "min-h-[64px] md:min-h-[96px]",
        open ? "h-auto" : "h-[64px] md:h-[96px]"
      )}
      style={{
        gap: "12px",
        borderWidth: "1px",
        backgroundColor: open ? "#002834" : "rgba(255, 255, 255, 1)",
        border: open ? "1px solid rgba(34, 34, 34, 1)" : "1px solid rgba(237, 238, 240, 1)",
      }}
    >
      {/* 아이콘 - 컨테이너 상단, 우측으로부터 32px */}
      <button
        onClick={handleOpenClick}
        className={clsx(
          "bg-transparent border-none cursor-pointer",
          "absolute flex items-center justify-center z-10",
          "top-4 right-4 w-5 h-5",
          "md:top-8 md:right-8 md:w-6 md:h-6"
        )}
      >
        {open ? (
          <Image
            src={"/images/minus-icon.png"}
            alt={"Collapse FAQ item"}
            title={"Collapse"}
            width={24}
            height={24}
            className={"object-contain w-full h-full"}
            loading={"lazy"}
          />
        ) : (
          <Image
            src={"/images/plus-icon.png"}
            alt={"Expand FAQ item"}
            title={"Expand"}
            width={24}
            height={24}
            className={"object-contain w-full h-full"}
            loading={"lazy"}
          />
        )}
      </button>
      
      <button
        onClick={handleOpenClick}
        className={clsx(
          "w-full flex items-center text-left bg-transparent",
          "pr-11 md:pr-14"
        )}
        style={{
          gap: "12px",
        }}
      >
        <p 
          className={clsx(
            "flex-1 text-sm md:text-base font-medium",
            open ? "text-white" : "text-[#0F0F0F]"
          )}
        >
          {title}
        </p>
      </button>
      {open && (
        <div 
          className={clsx(
            "text-xs md:text-sm leading-5 md:leading-6 text-white",
            "mt-3 md:mt-4"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
