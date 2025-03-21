"use client";

import { Main } from "@/components/main";
import Image from "next/image";
import { ActionPopup } from "@/components/action-popup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";

export default function G2E() {
  const sp = useSearchParams();
  const sms = sp.get("sms") === "sms";
  const router = useRouter();

  return (
    <>
      <div className={"bg-hero"}>
        <Main leftHref={"/referral"} rightHref={""}>
          <div
            className={
              "flex items-center z-10 relative h-[750px]  max-h-screen justify-center"
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
      </div>
      {sms && (
        <ActionPopup
          onClose={() => {
            router.replace("/");
          }}
        />
      )}
    </>
  );
}
