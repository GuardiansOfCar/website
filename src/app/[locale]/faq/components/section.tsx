"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";

export const FaqSection = ({
  title,
  children,
  defaultOpened = false,
}: {
  defaultOpened?: boolean;
  children: ReactNode;
  title: string;
}) => {
  const [open, setOpen] = useState(defaultOpened);

  const handleOpenClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <section
      className={
        "w-full max-w-[800px] border border-[#E0E1E5] rounded-2xl flex flex-col overflow-hidden"
      }
    >
      <button
        onClick={handleOpenClick}
        className={`py-4 px-5 flex items-center justify-between transition-colors ${
          open ? "bg-[#F0F9FA]" : "bg-white hover:bg-[#F9FBFB]"
        }`}
      >
        <p
          className={
            "text-base md:text-lg font-bold text-left mr-2 text-[#0F0F0F]"
          }
          style={{ fontFamily: "Pretendard, sans-serif" }}
        >
          {title}
        </p>
        <Image
          src={"/images/chervon-down-black.png"}
          alt={"Toggle FAQ"}
          width={20}
          height={20}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className={
            "border-t border-[#E0E1E5] py-4 px-5 text-sm md:text-base text-[#525252] bg-white"
          }
          style={{ fontFamily: "Pretendard, sans-serif" }}
        >
          {children}
        </div>
      )}
    </section>
  );
};
