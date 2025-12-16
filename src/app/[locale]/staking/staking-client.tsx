"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { StakingSection } from "@/app/[locale]/staking/components/section";
import { Button } from "@/components/button";
import { ButtonRenewal } from "@/components/button-renewal";
import { Popup } from "@/components/popup";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useWallet } from "@/lib/use-wallet";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { CopyrightFooter } from "@/components/copyright-footer";

export function StakingPageClient() {
  const t = useTranslations();

  const [unstakePopup, setUnstakePopup] = useState(false);
  const [buyPopup, setBuyPopup] = useState(false);
  const [claimPopup, setClaimPopup] = useState(false);
  const [stakePopup, setStakePopup] = useState(false);

  const handleBuyPopupClose = () => {
    setBuyPopup(false);
    stakeForm.reset();
  };

  const handleUnstakePopupClose = () => {
    setUnstakePopup(false);
    unstakeForm.reset();
  };

  const handleStakePopupClose = () => {
    setStakePopup(false);
    stakeForm.setValue("otp", ""); // OTP만 초기화
  };

  const handleClaimPopupClose = () => {
    setClaimPopup(false);
  };

  const wallet = useWallet();
  const [status, setStatus] = useState({
    stakedBalance: 0,
    availableBalance: 0,
  });

  const [total, setTotal] = useState({
    myPoolRate: "",
    totalStaked: 0,
  });

  const [estimated, setEstimated] = useState({
    id: 0,
    annualRate: "",
  });

  const { mutate } = useSWRConfig();

  useEffect(() => {
    mutate(["walletsInfo"]);

    fetch(`${API_BASE_URL}/stakings/status/estimated`).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        const data = (await res.json()) as {
          id: number;
          annualRate: string;
        };
        setEstimated(data);
      }
    });
  }, []);

  const fetchStatueTotalMe = () => {
    fetch(`${API_BASE_URL}/stakings/status/total/me/${wallet.id}`).then(
      async (res) => {
        if (res.status === 200 || res.status === 201) {
          const data = (await res.json()) as {
            myPoolRate: string;
            totalStaked: number;
          };
          setTotal(data);
        }
      }
    );
  };

  useEffect(() => {
    if (!wallet.id) return;

    fetchStatueTotalMe();
  }, [wallet.id]);

  const fetchStatusMe = () => {
    fetch(
      `${API_BASE_URL}/stakings/status/me/${wallet.id}?userWalletId=${wallet.id}`
    ).then(async (res) => {
      if (res.status === 200 || res.status === 201) {
        const data = (await res.json()) as {
          stakedBalance: number;
          availableBalance: number;
        };
        setStatus(data);
      }
    });
  };

  useEffect(() => {
    if (!wallet.id) return;

    fetchStatusMe();
  }, [wallet.id]);

  const [reward, setReward] = useState("");

  const fetchRewardMe = () => {
    fetch(`${API_BASE_URL}/stakings/reward/me/${wallet.id}`).then(
      async (res) => {
        if (res.status === 200 || res.status === 201) {
          const data = (await res.json()) as {
            reward: string;
          };
          setReward(data.reward);
        }
      }
    );
  };
  useEffect(() => {
    if (!wallet.id) return;
    fetchRewardMe();
  }, [wallet.id]);
  const router = useRouter();
  const stakeForm = useForm<{
    amount: string;
    otp: string;
  }>({
    defaultValues: { amount: "", otp: "" },
  });
  const unstakeForm = useForm<{
    amount: string;
    otp: string;
  }>({
    defaultValues: { amount: "", otp: "" },
  });
  const claimForm = useForm<{
    amount: string;
    otp: string;
  }>({
    defaultValues: { amount: "", otp: "" },
  });
  const stakeAmount = stakeForm.watch("amount");

  const handleStakeClick = () => {
    if (!wallet.icoAddress) return alert("You can connect wallet first.");

    const amount = parseFloat(stakeForm.getValues("amount"));
    if (!amount || amount <= 0) {
      return alert("Please enter a valid amount to stake.");
    }
    if (amount > status.availableBalance) {
      return alert("You cannot stake more than your available balance.");
    }

    setStakePopup(true);
    setBuyPopup(false); // stakeForm.reset()을 호출하지 않음
  };

  const handleAllClick = () => {
    stakeForm.setValue("amount", status.availableBalance.toString());
  };

  const handleUnstakeAllClick = () => {
    unstakeForm.setValue("amount", status.stakedBalance.toString());
  };

  const handleWithdrawal = async () => {
    const unstakeAmount = parseFloat(unstakeForm.getValues("amount"));
    if (!unstakeAmount || unstakeAmount <= 0) {
      return alert("Please enter a valid amount to unstake.");
    }
    if (unstakeAmount > status.stakedBalance) {
      return alert("You cannot unstake more than your staked balance.");
    }

    const otpRes = await fetch(
      `${API_BASE_URL}/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${unstakeForm.getValues("otp")}`
    );
    if (otpRes.status !== 200 && otpRes.status !== 201) {
      return alert("Invalid otp code. please try again.");
    }

    const res = await fetch(`${API_BASE_URL}/stakings/unstake/gocar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userWalletId: wallet.id,
        amount: unstakeAmount,
        otpCode: unstakeForm.getValues("otp"),
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      return alert("Failed to unstake your $GOTCAR. Please retry again.");
    }

    setUnstakePopup(false);
    fetchRewardMe();
    fetchStatueTotalMe();
    fetchStatusMe();
    unstakeForm.reset();
  };

  const handleClaimAllClick = () => {
    claimForm.setValue("amount", reward);
  };

  const handleClaimClick = async () => {
    const claimAmount = parseFloat(claimForm.getValues("amount"));
    if (!claimAmount || claimAmount <= 0) {
      return alert("Please enter a valid amount to claim.");
    }
    if (claimAmount > parseFloat(reward)) {
      return alert("You cannot claim more than your available rewards.");
    }

    const otpRes = await fetch(
      `${API_BASE_URL}/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${claimForm.getValues("otp")}`
    );
    if (otpRes.status !== 200 && otpRes.status !== 201) {
      return alert("Invalid otp code. please try again.");
    }

    const res = await fetch(`${API_BASE_URL}/stakings/claim/reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userWalletId: wallet.id,
        amount: claimAmount,
        otpCode: claimForm.getValues("otp"),
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      return alert("Failed to claim your rewards. Please retry again.");
    }

    setClaimPopup(false);
    fetchRewardMe();
    fetchStatueTotalMe();
    fetchStatusMe();
    claimForm.reset();
  };

  const handleStakeConfirmClick = async () => {
    const otpRes = await fetch(
      `${API_BASE_URL}/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${stakeForm.getValues("otp")}`
    );
    if (otpRes.status !== 200 && otpRes.status !== 201) {
      return alert("Invalid otp code. please try again.");
    }

    const res = await fetch(`${API_BASE_URL}/stakings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        icoWalletAddress: wallet.icoAddress,
        amount: Number.parseFloat(stakeAmount),
        otpCode: stakeForm.getValues("otp"),
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      return alert("Failed to stake your $GOTCAR. Please retry again.");
    }

    setStakePopup(false);
    fetchRewardMe();
    fetchStatueTotalMe();
    fetchStatusMe();

    stakeForm.reset();
  };

  return (
    <div>
      {buyPopup && (
        <Popup
          onClose={handleBuyPopupClose}
          title="STAKE $GOTCAR"
          titleAlign="center"
          showCloseButton={false}
        >
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p
                className={"text-center"}
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "rgba(93, 94, 96, 1)",
                }}
              >
                {t("staking.c2")}
              </p>
              <span
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "28px",
                  color: "rgba(15, 15, 15, 1)",
                }}
              >
                {status.availableBalance.toLocaleString()}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(0, 130, 162, 1)",
                    marginLeft: "8px",
                  }}
                >
                  $GOTCAR
                </span>
              </span>
            </div>

            <div className={"space-y-1"}>
              <div
                className={"flex items-center justify-between"}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  {t("staking.c7")}
                </p>
                <button
                  onClick={handleAllClick}
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(0, 85, 107, 1)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("staking.c6")}
                </button>
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: "338px",
                  height: "52px",
                  borderRadius: "12px",
                  border: stakeAmount
                    ? "1px solid rgba(0, 214, 221, 1)"
                    : "1px solid rgba(224, 225, 229, 1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <input
                  {...stakeForm.register("amount")}
                  placeholder="Enter amount"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                    backgroundColor: "transparent",
                  }}
                  className="[&::placeholder]:text-[rgba(120,121,124,1)] [&::placeholder]:font-normal"
                />
                <span
                  style={{
                    flexShrink: 0,
                    marginLeft: "8px",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "right",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  $GOTCAR
                </span>
              </div>
            </div>

            <div className={"flex flex-col space-y-3"}>
              <ButtonRenewal
                disabled={!stakeAmount}
                onClick={handleStakeClick}
                width="100%"
              >
                Stake $GOTCAR
              </ButtonRenewal>
              <ButtonRenewal
                onClick={handleBuyPopupClose}
                backgroundColor="rgba(47, 47, 49, 1)"
                borderColor="rgba(70, 71, 73, 1)"
                textColor="rgba(255, 255, 255, 1)"
                width="100%"
                height="52px"
              >
                Cancel
              </ButtonRenewal>
            </div>
          </div>
        </Popup>
      )}

      {unstakePopup && (
        <Popup
          onClose={handleUnstakePopupClose}
          title={t("staking.b1")}
          titleAlign="center"
          showCloseButton={false}
        >
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p
                className={"text-center"}
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "rgba(93, 94, 96, 1)",
                }}
              >
                {t("staking.c1")}
              </p>
              <span
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "28px",
                  color: "rgba(15, 15, 15, 1)",
                }}
              >
                {status.stakedBalance.toLocaleString()}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(0, 130, 162, 1)",
                    marginLeft: "8px",
                  }}
                >
                  $GOTCAR
                </span>
              </span>
            </div>

            <p
              className={"text-center"}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "22px",
                textAlign: "center",
                verticalAlign: "middle",
                color: "rgba(120, 121, 124, 1)",
              }}
            >
              {t("staking.b3")} {t("staking.b4")}
            </p>

            <div className={"space-y-1"}>
              <div
                className={"flex items-center justify-between"}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  Unstake Amount
                </p>
                <button
                  onClick={handleUnstakeAllClick}
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(0, 85, 107, 1)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ALL
                </button>
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: "338px",
                  height: "52px",
                  borderRadius: "12px",
                  border: unstakeForm.watch("amount")
                    ? "1px solid rgba(0, 214, 221, 1)"
                    : "1px solid rgba(224, 225, 229, 1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <input
                  {...unstakeForm.register("amount")}
                  type={"number"}
                  placeholder="Enter amount"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                    backgroundColor: "transparent",
                  }}
                  className="[&::placeholder]:text-[rgba(120,121,124,1)] [&::placeholder]:font-normal"
                />
                <span
                  style={{
                    flexShrink: 0,
                    marginLeft: "8px",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "right",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  $GOTCAR
                </span>
              </div>
            </div>

            <div className={"space-y-1"}>
              <div
                className={"flex items-center justify-between"}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  OTP Code
                </p>
              </div>
              <div
                style={{
                  width: "338px",
                  height: "52px",
                  borderRadius: "12px",
                  border: unstakeForm.watch("otp")
                    ? "1px solid rgba(0, 214, 221, 1)"
                    : "1px solid rgba(224, 225, 229, 1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <input
                  {...unstakeForm.register("otp")}
                  maxLength={6}
                  type={"text"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter OTP code"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                    backgroundColor: "transparent",
                  }}
                  className="[&::placeholder]:text-[rgba(120,121,124,1)] [&::placeholder]:font-normal"
                />
              </div>
            </div>

            <div className={"flex flex-col space-y-3"}>
              <ButtonRenewal
                onClick={handleWithdrawal}
                disabled={true}
                // 일시적으로 비활성화 (기존 활성화 로직 주석처리)
                // disabled={
                //   !unstakeForm.watch("amount") ||
                //   parseFloat(unstakeForm.watch("amount")) <= 0 ||
                //   !unstakeForm.watch("otp") ||
                //   String(unstakeForm.watch("otp")).length < 6
                // }
                width="100%"
              >
                UNSTAKE
              </ButtonRenewal>
              <ButtonRenewal
                onClick={handleUnstakePopupClose}
                backgroundColor="rgba(47, 47, 49, 1)"
                borderColor="rgba(70, 71, 73, 1)"
                textColor="rgba(255, 255, 255, 1)"
                width="100%"
                height="52px"
              >
                {t("staking.c13")}
              </ButtonRenewal>
            </div>
          </div>
        </Popup>
      )}

      {stakePopup && (
        <Popup
          onClose={handleStakePopupClose}
          title="Stake $GOTCAR"
          titleAlign="center"
          showCloseButton={false}
        >
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p
                className={"text-center"}
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "rgba(93, 94, 96, 1)",
                }}
              >
                Staking Amount
              </p>
              <span
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "28px",
                  color: "rgba(15, 15, 15, 1)",
                }}
              >
                {Number(stakeAmount).toLocaleString()}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(0, 130, 162, 1)",
                    marginLeft: "8px",
                  }}
                >
                  $GOTCAR
                </span>
              </span>
            </div>

            <p
              className={"text-center"}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "22px",
                color: "rgba(120, 121, 124, 1)",
              }}
            >
              You're about to stake the $GOTCAR amount shown above. Do you want
              to proceed?
            </p>

            <div className={"space-y-1"}>
              <div
                className={"flex items-center justify-between"}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  OTP Code
                </p>
              </div>
              <div
                style={{
                  width: "338px",
                  height: "52px",
                  borderRadius: "12px",
                  border: stakeForm.watch("otp")
                    ? "1px solid rgba(0, 214, 221, 1)"
                    : "1px solid rgba(224, 225, 229, 1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <input
                  {...stakeForm.register("otp")}
                  maxLength={6}
                  type={"text"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter OTP code"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(120, 121, 124, 1)",
                    backgroundColor: "transparent",
                  }}
                  className="[&::placeholder]:text-[rgba(120,121,124,1)] [&::placeholder]:font-normal"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <ButtonRenewal
                disabled={
                  !stakeAmount ||
                  !stakeForm.watch("otp") ||
                  String(stakeForm.watch("otp")).length < 6
                }
                onClick={handleStakeConfirmClick}
                width="100%"
              >
                Confirm
              </ButtonRenewal>
              <ButtonRenewal
                onClick={handleStakePopupClose}
                backgroundColor="#2F2F31"
                borderColor="#2F2F31"
                textColor="#FFFFFF"
                width="100%"
              >
                Cancel
              </ButtonRenewal>
            </div>
          </div>
        </Popup>
      )}

      {claimPopup && (
        <Popup
          onClose={handleClaimPopupClose}
          title={t("staking.f3")}
          titleAlign="center"
          showCloseButton={false}
        >
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p
                className={"text-center"}
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "rgba(93, 94, 96, 1)",
                }}
              >
                Available Rewards
              </p>
              <span
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "28px",
                  color: "rgba(15, 15, 15, 1)",
                }}
              >
                {reward && !isNaN(parseFloat(reward))
                  ? parseFloat(reward).toLocaleString()
                  : "0"}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "rgba(0, 130, 162, 1)",
                    marginLeft: "8px",
                  }}
                >
                  $GOTCAR
                </span>
              </span>
            </div>

            <p
              className={"text-center"}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "22px",
                textAlign: "center",
                verticalAlign: "middle",
                color: "rgba(120, 121, 124, 1)",
              }}
            >
              {t("staking.f4")}
            </p>
            <p
              className={"text-center"}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: "22px",
                textAlign: "center",
                verticalAlign: "middle",
                color: "rgba(207, 28, 28, 1)",
              }}
            >
              {t("staking.f5")}
            </p>

            <div className={"space-y-1"}>
              <div
                className={"flex items-center justify-between"}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  Claim Amount
                </p>
                <button
                  onClick={handleClaimAllClick}
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(0, 85, 107, 1)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ALL
                </button>
              </div>
              <div
                style={{
                  width: "338px",
                  height: "52px",
                  borderRadius: "12px",
                  border: claimForm.watch("amount")
                    ? "1px solid rgba(0, 214, 221, 1)"
                    : "1px solid rgba(224, 225, 229, 1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <input
                  {...claimForm.register("amount")}
                  type={"number"}
                  placeholder="Enter amount"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                    backgroundColor: "transparent",
                  }}
                  className="[&::placeholder]:text-[rgba(120,121,124,1)] [&::placeholder]:font-normal"
                />
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "right",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  $GOTCAR
                </span>
              </div>
            </div>

            <div className={"space-y-1"}>
              <div
                className={"flex items-center justify-between"}
                style={{ paddingLeft: "8px", paddingRight: "8px" }}
              >
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  OTP Code
                </p>
              </div>
              <div
                style={{
                  width: "338px",
                  height: "52px",
                  borderRadius: "12px",
                  border: claimForm.watch("otp")
                    ? "1px solid rgba(0, 214, 221, 1)"
                    : "1px solid rgba(224, 225, 229, 1)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <input
                  {...claimForm.register("otp")}
                  maxLength={6}
                  type={"text"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter OTP code"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    verticalAlign: "middle",
                    color: "rgba(120, 121, 124, 1)",
                    backgroundColor: "transparent",
                  }}
                  className="[&::placeholder]:text-[rgba(120,121,124,1)] [&::placeholder]:font-normal"
                />
              </div>
            </div>

            <div className={"flex flex-col space-y-3"}>
              <ButtonRenewal
                onClick={handleClaimClick}
                disabled={
                  !claimForm.watch("amount") ||
                  parseFloat(claimForm.watch("amount")) <= 0 ||
                  !claimForm.watch("otp") ||
                  String(claimForm.watch("otp")).length < 6
                }
                width="100%"
              >
                CLAIM
              </ButtonRenewal>
              <ButtonRenewal
                onClick={handleClaimPopupClose}
                backgroundColor="rgba(47, 47, 49, 1)"
                borderColor="rgba(70, 71, 73, 1)"
                textColor="rgba(255, 255, 255, 1)"
                width="100%"
                height="52px"
              >
                {t("staking.c13")}
              </ButtonRenewal>
            </div>
          </div>
        </Popup>
      )}

      <Main
        leftHref={"/faq"}
        rightHref={"/referral"}
        hideNav={true}
        horizontalPadding="px-0 max-desktop:px-4"
      >
        <div
          className={
            "flex flex-col items-center max-laptop:mt-[80px] w-[1312px] max-w-[1312px] max-desktop:w-full max-laptop:w-full max-laptop:max-w-full mx-auto"
          }
          style={{
            marginTop: "120px",
          }}
        >
          <div
            className={
              "flex flex-col space-y-4 max-desktop:space-y-4 items-center w-full mb-8 md:mb-12"
            }
          >
            <h1
              className={
                "text-center w-full text-[40px] leading-[48px] max-laptop:text-[24px] max-laptop:leading-[32px]"
              }
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: "#0F0F0F",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                }}
              >
                {t("staking.a1")}
              </span>
            </h1>
          </div>

          <div
            className={
              "grid grid-cols-4 max-laptop:grid-cols-2 max-tablet:flex max-tablet:flex-col w-[1312px] max-w-[1312px] max-desktop:w-full max-laptop:w-full max-laptop:max-w-full max-tablet:w-full max-tablet:max-w-full max-tablet:[&>section]:mt-0"
            }
            style={{
              borderRadius: "24px",
              gap: "16px",
              padding: "16px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 0px 8px 0px #0000000A",
            }}
          >
            <StakingSection
              title={t("staking.c1")}
              headerBorder
              description={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(15, 15, 15, 1)",
                    }}
                  >
                    {status.stakedBalance.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#0082A2",
                    }}
                  >
                    $GOTCAR
                  </span>
                </div>
              }
            >
              <div className={""}>
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    verticalAlign: "middle",
                    color: "rgba(93, 94, 96, 1)",
                  }}
                >
                  {t("staking.c2")}
                </span>
                <div className={"text-title-1b"}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "28px",
                        color: "rgba(15, 15, 15, 1)",
                      }}
                    >
                      {status.availableBalance.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 700,
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#0082A2",
                      }}
                    >
                      $GOTCAR
                    </span>
                  </div>
                </div>
              </div>
              <ButtonRenewal
                onClick={() => {
                  setBuyPopup(true);
                }}
              >
                {t("staking.c3")}
              </ButtonRenewal>
            </StakingSection>

            <StakingSection
              title={t("staking.d1")}
              headerBorder
              description={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(15, 15, 15, 1)",
                    }}
                  >
                    {total.myPoolRate && total.myPoolRate !== ""
                      ? total.myPoolRate.replace("%", "")
                      : "0"}
                  </span>
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "rgba(0, 130, 162, 1)",
                    }}
                  >
                    %
                  </span>
                </div>
              }
            >
              <div className={""}>
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    verticalAlign: "middle",
                    color: "rgba(93, 94, 96, 1)",
                  }}
                >
                  {t("staking.d2")}
                </span>
                <div className={"text-title-1b"}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "28px",
                        color: "rgba(15, 15, 15, 1)",
                      }}
                    >
                      {total.totalStaked.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontFamily: "Pretendard, sans-serif",
                        fontWeight: 700,
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#0082A2",
                      }}
                    >
                      $GOTCAR
                    </span>
                  </div>
                </div>
              </div>
            </StakingSection>

            <StakingSection
              title={t("staking.e1")}
              headerBorder
              description={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(15, 15, 15, 1)",
                    }}
                  >
                    {estimated.annualRate}
                  </span>
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "rgba(0, 130, 162, 1)",
                    }}
                  >
                    p/a
                  </span>
                </div>
              }
            >
              <div className={"flex flex-col"}>
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    verticalAlign: "middle",
                    color: "rgba(93, 94, 96, 1)",
                  }}
                >
                  {t("staking.e2")}
                </p>
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "22px",
                    verticalAlign: "middle",
                    color: "rgba(93, 94, 96, 1)",
                  }}
                >
                  {t("staking.e3")}
                </p>
                <p
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "22px",
                    verticalAlign: "middle",
                    color: "rgba(93, 94, 96, 1)",
                  }}
                >
                  {t("staking.e4")}
                </p>
              </div>
            </StakingSection>

            <StakingSection
              title={t("staking.f1")}
              description={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "rgba(15, 15, 15, 1)",
                    }}
                  >
                    {reward && reward !== "" && !isNaN(parseFloat(reward))
                      ? parseFloat(reward).toLocaleString()
                      : "0"}
                  </span>
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#0082A2",
                    }}
                  >
                    $GOTCAR
                  </span>
                </div>
              }
            >
              <ButtonRenewal
                onClick={() => {
                  setUnstakePopup(true);
                }}
              >
                {t("staking.b2")}
              </ButtonRenewal>
              <ButtonRenewal
                onClick={() => {
                  setClaimPopup(true);
                }}
                disabled={!reward || parseFloat(reward) < 1}
                backgroundColor="#2F2F31"
                borderColor="rgba(70, 71, 73, 1)"
                textColor="#FFFFFF"
              >
                {t("staking.f2")}
              </ButtonRenewal>
            </StakingSection>
          </div>

          {/* Notice Section */}
          <div
            className={
              "flex flex-col space-y-4 w-[1312px] max-w-[1312px] max-desktop:w-full max-laptop:w-full max-laptop:max-w-full mx-auto"
            }
            style={{
              marginTop: "80px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "0",
              paddingRight: "0",
            }}
          >
            <div className={"flex items-center justify-center w-full"}>
              <div
                className={"h-0 border-t flex-1"}
                style={{
                  borderColor: "#E0E1E5",
                  borderWidth: "1px",
                }}
              />
              <h2
                className={
                  "text-center align-middle whitespace-nowrap text-base md:text-[20px] leading-6 md:leading-[28px] px-4"
                }
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                  color: "#78797C",
                  verticalAlign: "middle",
                }}
              >
                {t("staking.notice.title")}
              </h2>
              <div
                className={"h-0 border-t flex-1"}
                style={{
                  borderColor: "#E0E1E5",
                  borderWidth: "1px",
                }}
              />
            </div>
            <div
              className={"flex flex-col space-y-4 text-center"}
              style={{
                marginTop: "40px",
              }}
            >
              <p
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#5D5E60",
                }}
              >
                {t("staking.notice.p1")}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {t("staking.notice.p1_bold")}
                </span>
                {t("staking.notice.p1_cont")}
                <br />
                {t("staking.notice.p2")}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {t("staking.notice.p2_bold")}
                </span>
                {t("staking.notice.p2_cont")}
                <br />
                <br />
              </p>
              <p
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#5D5E60",
                }}
              >
                {t("staking.notice.p3")}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {t("staking.notice.p3_bold")}
                </span>
                {t("staking.notice.p3_cont")}
                <span
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "22px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {t("staking.notice.p3_bold2")}
                </span>
                {t("staking.notice.p3_cont2")}
                <br />
                <br />
              </p>
              <p
                style={{
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "22px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#5D5E60",
                }}
              >
                {t("staking.notice.p4")}
                <br />
                {t("staking.notice.p5")}
              </p>
            </div>
          </div>
        </div>
      </Main>
      <div
        className={"w-full flex justify-center"}
        style={{
          paddingTop: "40px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <CopyrightFooter />
      </div>
    </div>
  );
}
