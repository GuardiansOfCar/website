"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import clsx, { ClassValue } from "clsx";

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
    <section className={"border-neutral-0 border-4 flex flex-col"}>
      <button
        onClick={handleOpenClick}
        className={clsx(
          " py-4 px-3 flex items-center justify-between bg-neutral-100",
          open && "!bg-primary-90",
        )}
      >
        <p className={"text-body-1b text-left mr-2"}>{title}</p>
        <Image
          src={"/images/chervon-down-black.png"}
          alt={"chervb"}
          width={16}
          height={16}
        />
      </button>
      {open && (
        <div
          className={
            "border-t-4 border-neutral-0 py-4 px-5 text-body-3 bg-neutral-100"
          }
        >
          {children}
        </div>
      )}
    </section>
  );
};
