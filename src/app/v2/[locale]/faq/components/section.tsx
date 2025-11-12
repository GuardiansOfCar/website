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
      style={{
        width: "1312px",
        height: open ? "auto" : "96px",
        borderRadius: "16px",
        paddingTop: "32px",
        paddingRight: "24px",
        paddingBottom: "32px",
        paddingLeft: "24px",
        gap: "16px",
        borderWidth: "1px",
        backgroundColor: open ? "#002834" : "rgba(255, 255, 255, 1)",
        border: open ? "1px solid rgba(34, 34, 34, 1)" : "1px solid rgba(237, 238, 240, 1)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      {/* 아이콘 - 컨테이너 상단, 우측으로부터 32px */}
      <button
        onClick={handleOpenClick}
        className={"bg-transparent border-none cursor-pointer"}
        style={{
          position: "absolute",
          top: "32px",
          right: "32px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {open ? (
          <Image
            src={"/images/minus-icon.png"}
            alt={"Collapse FAQ item"}
            title={"Collapse"}
            width={24}
            height={24}
            className={"object-contain"}
            loading={"lazy"}
          />
        ) : (
          <Image
            src={"/images/plus-icon.png"}
            alt={"Expand FAQ item"}
            title={"Expand"}
            width={24}
            height={24}
            className={"object-contain"}
            loading={"lazy"}
          />
        )}
      </button>
      
      <button
        onClick={handleOpenClick}
        className={"w-full flex items-center text-left bg-transparent"}
        style={{
          gap: "16px",
          paddingRight: "56px", // 아이콘 영역을 피하기 위한 padding
        }}
      >
        <p className={"text-body-1b flex-1"} style={{ color: open ? "#FFFFFF" : "#0F0F0F" }}>
          {title}
        </p>
      </button>
      {open && (
        <div 
          className={"text-body-3"}
          style={{
            color: "#FFFFFF",
            marginTop: "16px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
