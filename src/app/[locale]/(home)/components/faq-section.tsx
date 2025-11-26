"use client";

import { Main } from "@/components/main";
import { useState, ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import clsx from "clsx";

const FaqItem = ({
  title,
  children,
  open,
  onOpen,
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onOpen: (open: boolean) => void;
}) => {
  const handleOpenClick = () => {
    onOpen(!open);
  };

  return (
    <div
      onClick={handleOpenClick}
      className={clsx(
        "w-full flex flex-col relative transition-all duration-300 rounded-2xl",
        "p-4 md:p-8",
        "cursor-pointer"
      )}
      style={{
        gap: "12px",
        borderWidth: "1px",
        backgroundColor: open ? "#002834" : "rgba(255, 255, 255, 1)",
        border: open
          ? "1px solid rgba(34, 34, 34, 1)"
          : "1px solid rgba(237, 238, 240, 1)",
      }}
    >
      {/* 아이콘 - 컨테이너 상단, 우측으로부터 32px */}
      <div
        className={clsx(
          "bg-transparent border-none pointer-events-none",
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
      </div>

      <div
        className={clsx(
          "w-full flex items-center text-left bg-transparent",
          "pr-8 md:pr-12"
        )}
        style={{
          gap: "12px",
        }}
      >
        <p
          className={"flex-1 text-base md:text-2xl leading-6 md:leading-8"}
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontWeight: 700,
            letterSpacing: "normal",
            color: open ? "rgba(255, 255, 255, 1)" : "rgba(15, 15, 15, 1)",
          }}
        >
          {title}
        </p>
      </div>
      {open && (
        <div
          className={clsx(
            "mt-3 md:mt-4 text-[15px] md:text-lg leading-[22px] md:leading-7"
          )}
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontWeight: 400,
            letterSpacing: "normal",
            color: "rgba(207, 208, 212, 1)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const FaqSection = () => {
  const t = useTranslations();
  const [openIndex, setOpenIndex] = useState<number | undefined>(undefined);

  const FAQ_ITEMS = [
    { question: t("home.faq.q1"), answer: t("home.faq.a1") },
    { question: t("home.faq.q2"), answer: t("home.faq.a2") },
    { question: t("home.faq.q3"), answer: t("home.faq.a3") },
    { question: t("home.faq.q4"), answer: t("home.faq.a4") },
    { question: t("home.faq.q5"), answer: t("home.faq.a5") },
    { question: t("home.faq.q6"), answer: t("home.faq.a6") },
    { question: t("home.faq.q7"), answer: t("home.faq.a7") },
  ];

  return (
    <div className={"bg-[#F9FBFB]"}>
      <Main
        leftHref={""}
        rightHref={""}
        hideNav
        horizontalPadding={"px-4 md:px-0"}
      >
        <div
          className={
            "flex flex-col items-center pt-10 md:pt-[80px] pb-10 md:pb-[80px] w-full max-w-[1312px] mx-auto"
          }
          id="faq"
        >
          <h2
            className={
              "text-2xl md:text-[40px] text-[#0F0F0F] mb-8 md:mb-12 text-center font-bold leading-tight md:leading-[48px]"
            }
            style={{ fontFamily: "Pretendard, sans-serif" }}
          >
            {t("home.faq.title")}
          </h2>

          <div className={"flex flex-col w-full gap-4"}>
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={index}
                open={openIndex === index}
                onOpen={(isOpen) => {
                  setOpenIndex(isOpen ? index : undefined);
                }}
                title={item.question}
              >
                {item.answer}
              </FaqItem>
            ))}
          </div>
        </div>
      </Main>
    </div>
  );
};
