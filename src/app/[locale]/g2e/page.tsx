"use client";

import { Main } from "@/components/main";
import { ActionPopup } from "@/components/action-popup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";

export default function G2E() {
  const sp = useSearchParams();
  const sms = sp.get("sms") === "sms";
  const router = useRouter();

  return (
    <>
      {sms && (
        <ActionPopup
          onClose={() => {
            router.replace("/");
          }}
        />
      )}
      <div className={"bg-hero"}>
        <Main leftHref={"/referral"} rightHref={""}>
          <div
            className={
              "flex items-center z-10 relative h-[750px]  max-h-screen justify-center"
            }
          >
            <video width="300" height="400" autoPlay={true} loop>
              <source src="/videos/g2e.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </Main>
      </div>
    </>
  );
}
