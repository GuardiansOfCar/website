"use client";

import { ActionPopup } from "@/components/action-popup";
import { useState } from "react";
import { useWallet } from "@/lib/use-wallet";
import { API_BASE_URL } from "@/lib/constants";
import { OtpPopup } from "@/components/otp-popup";
import { useRouter } from "@/i18n/routing";

export default function SubmitPage() {
  const wallet = useWallet();

  const [solanaAddress, setSolanaAddress] = useState("");

  const handleSubmit = (solanaAddress: string) => {
    setSolanaAddress(solanaAddress);
    setOtpOpen(true);
  };
  const [otpOpen, setOtpOpen] = useState(false);

  const router = useRouter();

  const handleOtpSubmit = async (otpCode: string) => {
    const res = await fetch(`${API_BASE_URL}/v1/wallets/update`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify({
        icoWalletAddress: wallet.icoAddress,
        solanaAddress,
        otpCode,
      }),
    });

    if (res.status !== 200) {
      return alert("Failed to update Solana Address.");
    }
    alert("Solana address update was successful.");
    router.push("/");
  };

  return (
    <div className={"bg-hero h-screen flex flex-col w-full"}>
      <ActionPopup onSubmit={handleSubmit} />

      {otpOpen && (
        <OtpPopup
          onClose={() => {
            setOtpOpen(false);
          }}
          onEnter={handleOtpSubmit}
        />
      )}
    </div>
  );
}
