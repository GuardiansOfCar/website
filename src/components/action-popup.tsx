"use client";
import { ReactNode } from "react";
import Image from "next/image";
import { useClickAway, useLockBodyScroll } from "@uidotdev/usehooks";
import { Button } from "@/components/button";

export const ActionPopup = ({
  onClose,
  title,
  placeholder,
}: {
  placeholder: string;
  onClose: () => void;
  title: ReactNode;
}) => {
  const ref = useClickAway<HTMLDivElement>(() => {
    onClose();
  });

  useLockBodyScroll();

  return (
    <div
      className={
        "fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-[#0000007A]"
      }
    >
      <div
        className={
          "bg-neutral-100 border-neutral-0 border-4 w-[828px] pb-9 px-9"
        }
        ref={ref}
      >
        <div className={"py-8 flex items-center justify-center "}>
          <span className={"text-header-3"}>{title}</span>
        </div>
        <div className={"flex w-full space-x-8"}>
          <input
            placeholder={placeholder}
            className={
              "bg-[#CDE7E5] text-title-1 px-4 py-[18px] flex-1 placeholder:text-[#646464]"
            }
          />
          <Button className={"w-[240px]"} onClick={onClose}>SUBMIT</Button>
        </div>
      </div>
    </div>
  );
};
