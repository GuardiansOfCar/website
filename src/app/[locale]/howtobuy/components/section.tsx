"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import clsx, { ClassValue } from "clsx";

export const HowtobuySection = ({
                                  title,
                                  openClassName,
                                  children,
                                  defaultOpened = false,
                                }: {
  defaultOpened?: boolean;
  children: ReactNode;
  title: string;
  openClassName: ClassValue;
}) => {
  const [open, setOpen] = useState(defaultOpened);

  const handleOpenClick = () => {
    setOpen((prev) => !prev);
  };

  return (
      <section className={"w-[400px] border-neutral-0 border-4 flex flex-col"}>
        <button
            onClick={handleOpenClick}
            className={clsx(
                " py-4 px-3 flex items-center justify-between bg-neutral-100",
                open && openClassName,
            )}
        >
          <p className={"text-body-1b"}>{title}</p>
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

