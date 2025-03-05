"use client";

import { Main } from "@/components/main";
import Image from "next/image";
import { useState } from "react";
import { ActionPopup } from "@/components/action-popup";

export default function G2E() {
  const [t, sett] = useState(false);
  return (
    <Main leftHref={"/referral"} rightHref={""}>
      {t && (
        <ActionPopup
          placeholder={"Enter referral code"}
          title={"SUBMIT SOLANA WALLET ADDRESS"}
          onClose={() => sett(false)}
        />
      )}

      <div
        className={
          "py-10 pl-14 flex items-center z-10 relative h-[750px] justify-center"
        }
      >
        <Image
          className={"absolute"}
          src={"/images/mockup.png"}
          alt={"m"}
          width={200}
          height={400}
        />
        <h1 className={"text-primary text-header-1 relative z-10"}>
          COMING SOON...
        </h1>
      </div>
    </Main>
  );
}
