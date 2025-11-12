"use client";

import { ReactNode } from "react";
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
    <div className={"border-b border-neutral-60"}>
      <button
        onClick={handleOpenClick}
        className={clsx(
          "w-full py-4 px-4 flex items-center justify-between text-left bg-transparent hover:bg-neutral-80 transition-colors"
        )}
      >
        <p className={"text-body-1b text-[#0F0F0F] flex-1"}>{title}</p>
        <div className={"flex-shrink-0 ml-4 w-6 h-6 flex items-center justify-center"}>
          {open ? (
            <span className={"text-primary text-2xl font-bold"}>−</span>
          ) : (
            <span className={"text-primary text-2xl font-bold"}>+</span>
          )}
        </div>
      </button>
      {open && (
        <div className={"py-4 px-4 text-body-3 text-[#0F0F0F] bg-transparent"}>
          {children}
        </div>
      )}
    </div>
  );
};
