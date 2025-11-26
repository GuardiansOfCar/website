"use client";

import Image from "next/image";
import { useMetaMask } from "@/lib/use-metamask";
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
  // const phantom = usePhantom();
  const trustWallet = useTrustWallet();
  const walletConnect = useWalletConnect();

  const handleClick = () => {
    if (type === "metamask") {
      if (create) {
        wrapWindow?.open("https://metamask.io/");
      } else {
        metaMask.connect();
      }
    } /*else if (type === "phantom") {
      if (create) {
        wrapWindow?.open("https://phantom.com/");
      } else {
        phantom.connect();
      }
    }*/ else if (type === "trust") {
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

  const getLogoBackground = () => {
    if (type === "connect") {
      return "rgba(59, 153, 252, 1)"; // Wallet Connect blue
    }
    return "rgba(255, 255, 255, 1)"; // White for Trust Wallet and MetaMask
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: "338px",
        height: "52px",
        borderRadius: "12px",
        borderWidth: "1px",
        border: "1px solid rgba(0, 214, 221, 1)",
        backgroundColor: "rgba(33, 234, 241, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "16px",
        paddingRight: "0",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(33, 234, 241, 0.9)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(33, 234, 241, 1)";
      }}
    >
      <span
        style={{
          fontFamily: "Pretendard, sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
          color: "rgba(0, 0, 0, 1)",
        }}
      >
        {type === "metamask"
          ? "MetaMask"
          : type === "trust"
            ? "Trust Wallet"
            : "Wallet Connect"}
      </span>

      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "12px",
          borderWidth: "1px",
          border: "1px solid rgba(0, 214, 221, 1)",
          background:
            type === "connect"
              ? "linear-gradient(180deg, #556FFF 0%, #3353FC 100%)"
              : "rgba(255, 255, 255, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Image
          className={"object-contain"}
          src={
            type === "metamask"
              ? "/images/metamask.png"
              : type === "trust"
                ? "/images/trustwallet.png"
                : "/images/walletconnect.png"
          }
          alt={"Wallet Icon"}
          width={type === "connect" ? 24 : 32}
          height={type === "connect" ? 24 : 32}
        />
      </div>
    </button>
  );
};
