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
        ref={ref}
        style={{
          width: "370px",
          maxWidth: "1312px",
          borderRadius: "24px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgba(237, 238, 240, 1)",
          backgroundColor: "rgba(255, 255, 255, 1)",
          boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.04)",
          paddingTop: "24px",
          paddingRight: "16px",
          paddingBottom: "16px",
          paddingLeft: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          className={
            "flex items-center justify-between"
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
        <div className={"flex w-full flex-col"}>{children}</div>
      </div>
    </div>
  );
};
