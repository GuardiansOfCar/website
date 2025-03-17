"use client";

import Image from "next/image";
import { useMetaMask } from "@/lib/use-metamask";
import { usePhantom } from "@/lib/use-phantom";
import { useTrustWallet } from "@/lib/use-trust-wallet";
import { useWalletConnect } from "@/lib/use-wallet-connect";
import { useWallet } from "@/lib/use-wallet";
import { wrapWindow } from "@/lib/constants";

export const Wallet = ({
  type,
  create,
}: {
  create?: boolean;
  type: "phantom" | "metamask" | "trust" | "connect";
}) => {
  const wallet = useWallet();
  const metaMask = useMetaMask();
  const phantom = usePhantom();
  const trustWallet = useTrustWallet();
  const walletConnect = useWalletConnect();
  const handleClick = () => {
    if (type === "metamask") {
      if (create) {
        wrapWindow?.open("https://metamask.io/");
      } else {
        metaMask.connect();
      }
    } else if (type === "phantom") {
      if (create) {
        wrapWindow?.open("https://phantom.com/");
      } else {
        phantom.connect();
      }
    } else if (type === "trust") {
      if (create) {
        wrapWindow?.open("https://trustwallet.com/");
      } else {
        trustWallet.connect();
      }
    } else {
      if (create) {
        wrapWindow?.open("https://walletconnect.network/");
      } else {
        walletConnect.connect();
      }
    }
  };

  if (wallet.network === "SOL" && type === "metamask") return null;
  if (type === "phantom") return null;

  return (
    <button
      onClick={handleClick}
      className={"border-neutral-0 border-4 h-[56px] flex"}
    >
      <div
        className={
          "flex-1 flex items-center px-3 bg-primary border-r-neutral-0 border-r-4 "
        }
      >
        <p className={"text-title-1 text-left shadow-text text-neutral-100"}>
          {type === "phantom"
            ? "PHANTOM"
            : type === "metamask"
              ? "METAMASK"
              : type === "trust"
                ? "TRUST WALLET"
                : "WALLET CONNECT"}
        </p>
      </div>

      <div className={"bg-white w-[52px] relative"}>
        <Image
          className={"object-cover"}
          src={
            type === "phantom"
              ? "/images/phantom.png"
              : type === "metamask"
                ? "/images/metamask.png"
                : type === "trust"
                  ? "/images/trustwallet.png"
                  : "/images/walletconnect.png"
          }
          alt={"Wallet Icon"}
          fill
        />
      </div>
    </button>
  );
};
