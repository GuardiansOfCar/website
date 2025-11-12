"use client";
import { ReactNode } from "react";
import Image from "next/image";
import { useClickAway, useLockBodyScroll } from "@uidotdev/usehooks";

export const Popup = ({
  onClose,
  children,
  title,
}: {
  onClose: () => void;
  children: ReactNode;
  title: ReactNode;
}) => {
  const ref = useClickAway<HTMLDivElement>(() => {
    onClose();
  });

  useLockBodyScroll();

  return (
    <div
      className={
        "fixed top-0 left-0 right-0 bottom-0 z-[300] flex items-center justify-center bg-[#0000007A]"
      }
    >
      <div
        className={"bg-neutral-100 border-neutral-0 border-4 w-[400px]"}
        ref={ref}
      >
        <div
          className={
            "border-neutral-0 border-b-4 px-3 py-4 flex items-center justify-between bg-primary-90"
          }
        >
          <span className={"text-body-1b"}>{title}</span>
          <button onClick={onClose}>
            <Image
              src={"/images/close.png"}
              alt={"close"}
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className={"flex p-3 py-5 w-full flex-col"}>{children}</div>
      </div>
    </div>
  );
};
