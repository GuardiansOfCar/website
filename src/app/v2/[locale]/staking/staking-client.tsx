"use client";

import { Main } from "@/app/v2/components/main";
import { useTranslations } from "next-intl";
import { StakingSection } from "@/app/v2/[locale]/staking/components/section";
import { Button } from "@/components/button";
import { ButtonRenewal } from "@/app/v2/components/button-renewal";
import { Popup } from "@/app/v2/components/popup";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useWallet } from "@/lib/use-wallet";
import { useRouter } from "@/app/v2/i18n/navigation";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { CopyrightFooter } from "@/app/v2/components/copyright-footer";

export function StakingPageClient() {
  const t = useTranslations();

  const [unstakePopup, setUnstakePopup] = useState(false);
  const [buyPopup, setBuyPopup] = useState(false);
  const [claimPopup, setClaimPopup] = useState(false);
  const [stakePopup, setStakePopup] = useState(false);

  const handleBuyPopupClose = () => {
    setBuyPopup(false);
  };

  const handleUnstakePopupClose = () => {
    setUnstakePopup(false);
  };

  const handleStakePopupClose = () => {
    setStakePopup(false);
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

    fetch(`${API_BASE_URL}/v1/stakings/status/estimated`).then(async (res) => {
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
    fetch(`${API_BASE_URL}/v1/stakings/status/total/me/${wallet.id}`).then(
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
      `${API_BASE_URL}/v1/stakings/status/me/${wallet.id}?userWalletId=${wallet.id}`
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
    fetch(`${API_BASE_URL}/v1/stakings/reward/me/${wallet.id}`).then(
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
    otp: string;
  }>({
    defaultValues: { otp: "" },
  });
  const claimForm = useForm<{
    otp: string;
  }>({
    defaultValues: { otp: "" },
  });
  const stakeAmount = stakeForm.watch("amount");

  const handleStakeClick = () => {
    if (!wallet.icoAddress) return alert("You can connect wallet first.");
    setStakePopup(true);
    handleBuyPopupClose();
  };

  const handleAllClick = () => {
    stakeForm.setValue("amount", status.availableBalance.toString());
  };

  const handleWithdrawal = async () => {
    const otpRes = await fetch(
      `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${unstakeForm.getValues("otp")}`
    );
    if (otpRes.status !== 200 && otpRes.status !== 201) {
      return alert("Invalid otp code. please try again.");
    }

    const res = await fetch(`${API_BASE_URL}/v1/stakings/unstake/gocar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userWalletId: wallet.id,
        amount: status.stakedBalance,
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

  const handleClaimClick = async () => {
    const otpRes = await fetch(
      `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${claimForm.getValues("otp")}`
    );
    if (otpRes.status !== 200 && otpRes.status !== 201) {
      return alert("Invalid otp code. please try again.");
    }

    const res = await fetch(`${API_BASE_URL}/v1/stakings/claim/reward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userWalletId: wallet.id,
        amount: parseFloat(reward),
        otpCode: claimForm.getValues("otp"),
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      return alert("Failed to unstake your $GOTCAR. Please retry again.");
    }

    setClaimPopup(false);
    fetchRewardMe();
    fetchStatueTotalMe();
    fetchStatusMe();
    claimForm.reset();
  };

  const handleStakeConfirmClick = async () => {
    const otpRes = await fetch(
      `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${stakeForm.getValues("otp")}`
    );
    if (otpRes.status !== 200 && otpRes.status !== 201) {
      return alert("Invalid otp code. please try again.");
    }

    const res = await fetch(`${API_BASE_URL}/v1/stakings`, {
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
        <Popup onClose={handleBuyPopupClose} title={t("staking.c4")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p className={"text-center text-body-3"}>{t("staking.c2")}</p>
              <span className={"text-header-3"}>
                {status.availableBalance.toLocaleString()}{" "}
                <span className={"text-header-3 text-primary-10"}>$GOTCAR</span>
              </span>
            </div>

            <div className={"space-y-1"}>
              <div className={"flex items-center justify-between"}>
                <p className={"text-body-3"}>{t("staking.c7")}</p>
                <button onClick={handleAllClick} className={"text-body-3b"}>
                  {t("staking.c6")}
                </button>
              </div>
              <div className={"bg-[#CDE7E5] flex"}>
                <input
                  {...stakeForm.register("amount")}
                  className={
                    "py-3 px-2 bg-transparent text-body-2 rounded-none flex-1"
                  }
                />
                <span className={"m-4 text-title-1 text-primary-0"}>
                  $GOTCAR
                </span>
              </div>
            </div>

            <ButtonRenewal
              disabled={!stakeAmount}
              onClick={handleStakeClick}
              width="100%"
            >
              {t("staking.c9")}
            </ButtonRenewal>
          </div>
        </Popup>
      )}

      {unstakePopup && (
        <Popup onClose={handleUnstakePopupClose} title={t("staking.b1")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p className={"text-center text-body-3"}>{t("staking.c1")}</p>
              <span className={"text-header-3"}>
                {status.stakedBalance.toLocaleString()}{" "}
                <span className={"text-header-3 text-primary-10"}>$GOTCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center"}>
              {t("staking.b3")} {t("staking.b4")}
            </p>

            <div className={"space-y-1 w-full"}>
              <p className={"text-body-3"}>otp Code</p>
              <input
                {...unstakeForm.register("otp")}
                max={6}
                maxLength={6}
                type={"number"}
                className={
                  "py-3 px-2 bg-[#CDE7E5] text-body-2 rounded-none w-full"
                }
              />
            </div>

            <ButtonRenewal onClick={handleWithdrawal} disabled width="100%">
              WITHDRAWAL
            </ButtonRenewal>
            <ButtonRenewal
              onClick={handleUnstakePopupClose}
              backgroundColor="#2F2F31"
              borderColor="#2F2F31"
              textColor="#FFFFFF"
              width="100%"
            >
              {t("staking.c13")}
            </ButtonRenewal>
          </div>
        </Popup>
      )}

      {stakePopup && (
        <Popup onClose={handleStakePopupClose} title="Stake $GOTCAR">
          <div className={"flex flex-col space-y-6"}>
            <div className={"flex flex-col items-center justify-center"}>
              <span
                className={"text-header-3"}
                style={{ fontSize: "32px", lineHeight: "40px" }}
              >
                {Number(stakeAmount).toLocaleString()}{" "}
                <span className={"text-[#0082A2]"}>$GOTCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center text-[#5D5E60]"}>
              You’re about to stake the $GOCAR amount shown above. Do you want
              to proceed?
            </p>

            <div className={"space-y-1 w-full"}>
              <p className={"text-body-3"}>otp Code</p>
              <input
                {...stakeForm.register("otp")}
                max={6}
                maxLength={6}
                type={"number"}
                className={
                  "py-3 px-2 bg-[#CDE7E5] text-body-2 rounded-none w-full"
                }
              />
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <ButtonRenewal
                disabled={!stakeAmount}
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
        <Popup onClose={handleClaimPopupClose} title={t("staking.f3")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <span className={"text-header-3"}>
                {reward}{" "}
                <span className={"text-header-3 text-primary-10"}>$GOTCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center"}>{t("staking.f4")}</p>
            <p className={"text-body-3 text-center text-[#CF1C1C]"}>
              {t("staking.f5")}
            </p>

            <div className={"space-y-1 w-full"}>
              <p className={"text-body-3"}>otp Code</p>
              <input
                {...claimForm.register("otp")}
                max={6}
                maxLength={6}
                type={"number"}
                className={
                  "py-3 px-2 bg-[#CDE7E5] text-body-2 rounded-none w-full"
                }
              />
            </div>

            <Button disabled onClick={handleClaimClick}>
              CLAIM
            </Button>
            <Button
              onClick={handleClaimPopupClose}
              className={"!bg-neutral-40"}
            >
              {t("staking.c13")}
            </Button>
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
            "flex flex-col items-center max-desktop:mt-[80px] w-[1312px] max-w-[1312px] max-desktop:w-full max-desktop:max-w-full mx-auto"
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
                "text-center w-full text-[40px] leading-[48px] max-desktop:text-[24px] max-desktop:leading-[32px]"
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
                GOTCAR
              </span>{" "}
              <span
                style={{
                  color: "#00D6DD",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 700,
                }}
              >
                Token Staking
              </span>
            </h1>
          </div>

          <div
            className={
              "grid grid-cols-4 max-desktop:flex max-desktop:flex-col w-[1312px] max-w-[1312px] max-desktop:w-full max-desktop:max-w-full max-desktop:[&>section]:mt-0"
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
                  setClaimPopup(false);
                }}
                disabled={true}
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
              "flex flex-col space-y-4 w-[1312px] max-w-[1312px] max-desktop:w-full max-desktop:max-w-full max-desktop:mx-auto"
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
                Notice
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
                It may take{" "}
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
                  7 days
                </span>{" "}
                for your tokens to be fully unstaked after you submit an unstake
                request.
                <br />
                After the unstaking period ends, an{" "}
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
                  additional processing time of up to 3 days
                </span>{" "}
                may be required for withdrawal completion.
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
                Unstaking will become available{" "}
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
                  after the official token launch
                  <br />
                </span>
                . Please note that there may be{" "}
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
                  up to a 10-day difference
                </span>{" "}
                in withdrawal timing compared to users who did not stake their
                tokens.
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
                This time window is designed to maintain network stability and
                ensure a smooth token circulation process during the early phase
                of the ecosystem.
                <br />
                We appreciate your patience and commitment as a Guardian
                contributing to the strength of the GOTCAR network.
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
