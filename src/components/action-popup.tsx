"use client";

import { useClickAway, useLockBodyScroll } from "@uidotdev/usehooks";
import { Button } from "@/components/button";

export const ActionPopup = ({ onClose }: { onClose: () => void }) => {
  const ref = useClickAway<HTMLDivElement>(() => {
    onClose();
  });

  useLockBodyScroll();

  return (
    <div
      className={
        "fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-[#0000007A]"
      }
    >
      <div
        className={
          "bg-neutral-100 border-neutral-0 border-4 w-full max-w-[828px] mx-5 pb-9 px-9 max-laptop:px-5 max-laptop:pb-5"
        }
        ref={ref}
      >
        <div
          className={"py-8 max-laptop:py-6 flex items-center justify-center "}
        >
          <span className={"text-header-3"}>SUBMIT SOLANA WALLET ADDRESS</span>
        </div>
        <div
          className={"flex w-full gap-8 max-laptop:flex-col max-laptop:gap-6"}
        >
          <input
            placeholder={"Connect your wallet to proceed"}
            className={
              "bg-[#CDE7E5] text-title-1 px-4 py-[18px] flex-1 placeholder:text-[#646464]"
            }
          />
          <Button className={"min-w-[240px]"} onClick={onClose}>
            SUBMIT
          </Button>
        </div>

        <div className={"text-body-3 text-[#646464] mt-8"}>
          * Please enter it exactly as it appears, including upper and lower
          case.
          <br />
          • If you participated using the ETH or BNB network, you need to enter
          an SOL network address to claim $GOCAR.
          <br />• Please create an SOL address using a wallet that supports the
          SOL network, such as Trust Wallet, and then enter it.
        </div>
      </div>
    </div>
  );
};
