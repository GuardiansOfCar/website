"use client";
import { ReactNode, useRef } from "react";
import Image from "next/image";
import { useLockBodyScroll } from "@uidotdev/usehooks";

export const Popup = ({
  onClose,
  children,
  title,
  titleAlign = "left",
  showCloseButton = true,
}: {
  onClose: () => void;
  children: ReactNode;
  title: ReactNode;
  titleAlign?: "left" | "center";
  showCloseButton?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLockBodyScroll();

  return (
    <div
      className={
        "fixed top-0 left-0 right-0 bottom-0 z-[300] flex items-center justify-center bg-[#0000007A]"
      }
      onClick={(e) => {
        // 배경(오버레이) 클릭 시에만 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={ref}
        onClick={(e) => {
          // 팝업 내부 클릭 시 이벤트 전파 방지
          e.stopPropagation();
        }}
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
            titleAlign === "center"
              ? "flex items-center justify-between relative"
              : "flex items-center justify-between"
          }
        >
          <span
            className={
              titleAlign === "center" ? "flex-1 text-center" : "text-body-1b"
            }
            style={
              titleAlign === "center"
                ? {
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "18px",
                    lineHeight: "26px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }
                : undefined
            }
          >
            {title}
          </span>
          {showCloseButton && (
            <button
              onClick={onClose}
              className={titleAlign === "center" ? "absolute right-0" : ""}
            >
              <Image
                src={"/images/close.png"}
                alt={"close"}
                width={16}
                height={16}
              />
            </button>
          )}
        </div>
        <div className={"flex w-full flex-col"}>{children}</div>
      </div>
    </div>
  );
};
