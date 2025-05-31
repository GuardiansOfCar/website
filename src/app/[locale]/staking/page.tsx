"use client";

import { Main } from "@/components/main";
import { useTranslations } from "next-intl";
import { StakingSection } from "@/app/[locale]/staking/components/section";
import { Button } from "@/components/button";
import Image from "next/image";
import { StakingSupply } from "@/app/[locale]/staking/components/supply";
import { Popup } from "@/components/popup";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useWallet } from "@/lib/use-wallet";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import {useSWRConfig} from "swr";

export default function StakingPage() {
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
      },
    );
  };

  useEffect(() => {
    if (!wallet.id) return;

    fetchStatueTotalMe();
  }, [wallet.id]);

  const fetchStatusMe = () => {
    fetch(
      `${API_BASE_URL}/v1/stakings/status/me/${wallet.id}?userWalletId=${wallet.id}`,
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
      },
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
  const handleStakePurchaseClick = () => {
    router.push(`/?amount=${stakeForm.getValues("amount")}`);
  };
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
      `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${unstakeForm.getValues("otp")}`,
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
      `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${claimForm.getValues("otp")}`,
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
      `${API_BASE_URL}/v1/wallets/check/otp?icoWalletAddress=${wallet.icoAddress}&otpCode=${stakeForm.getValues("otp")}`,
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
    <div className={"bg-hero"}>
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

            <Button onClick={handleStakePurchaseClick}>
              {t("staking.c8")}
            </Button>
            <Button disabled={!stakeAmount} onClick={handleStakeClick}>
              {t("staking.c9")}
            </Button>
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

            <Button onClick={handleWithdrawal} disabled>
              WITHDRAWAL
            </Button>
            <Button
              onClick={handleUnstakePopupClose}
              className={"!bg-neutral-40"}
            >
              {t("staking.c13")}
            </Button>
          </div>
        </Popup>
      )}

      {stakePopup && (
        <Popup onClose={handleStakePopupClose} title={t("staking.c9")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p className={"text-center text-body-3"}>{t("staking.c2")}</p>
              <span className={"text-header-3"}>
                {stakeAmount.toLocaleString()}{" "}
                <span className={"text-header-3 text-primary-10"}>$GOTCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center"}>{t("staking.c11")}</p>

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

            <Button disabled={!stakeAmount} onClick={handleStakeConfirmClick}>
              {t("staking.c12")}
            </Button>
            <Button
              onClick={handleStakePopupClose}
              className={"!bg-neutral-40"}
            >
              {t("staking.c13")}
            </Button>
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

      <Main leftHref={"/faq"} rightHref={"/referral"}>
        <div className={"flex flex-col space-y-8 items-start"}>
          <div className={"flex flex-col space-y-4"}>
            <h2 className={"text-header-2 text-primary"}>{t("staking.a1")}</h2>
            <p className={"text-body-3 text-neutral-100"}>{t("staking.a2")}</p>
          </div>

          <div className={"grid grid-cols-4 gap-x-5 self-stretch max-tablet:flex max-tablet:flex-col max-tablet:space-y-4"}>
            <StakingSection
              title={t("staking.c1")}
              headerBorder
              description={
                <>
                  <span>
                    {status.stakedBalance.toLocaleString()}{" "}
                    <span className={"text-primary-10"}>$GOTCAR</span>
                  </span>
                </>
              }
            >
              <div className={""}>
                <span className={"text-body-3"}>{t("staking.c2")}</span>
                <div className={"text-title-1b"}>
                  <span>
                    {status.availableBalance.toLocaleString()}{" "}
                    <span className={"text-primary-10"}>$GOTCAR</span>
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setBuyPopup(true);
                }}
              >
                {t("staking.c3")}
              </Button>
            </StakingSection>

            <StakingSection
              title={t("staking.d1")}
              headerBorder
              description={
                <>
                  <span>{total.myPoolRate}</span>
                </>
              }
            >
              <div className={""}>
                <span className={"text-body-3"}>{t("staking.d2")}</span>
                <div className={"text-title-1b"}>
                  <span>
                    {total.totalStaked.toLocaleString()}{" "}
                    <span className={"text-primary-10"}>$GOTCAR</span>
                  </span>
                </div>
              </div>
            </StakingSection>

            <StakingSection
              title={t("staking.e1")}
              description={
                <>
                  <span>
                    {estimated.annualRate}
                    <span className={"text-label-1 ml-1"}>p/a</span>
                  </span>
                </>
              }
            >
              <div className={"flex flex-col space-y-2"}>
                <p className={"text-label-1"}>{t("staking.e2")}</p>
                <p className={"text-label-1"}>{t("staking.e3")}</p>
                <p className={"text-label-1"}>{t("staking.e4")}</p>
              </div>
            </StakingSection>

            <StakingSection
              title={t("staking.f1")}
              description={
                <>
                  <span>
                    {reward} <span className={"text-primary-10"}>$GOTCAR</span>
                  </span>
                </>
              }
            >
              <Button
                onClick={() => {
                  setUnstakePopup(true);
                }}
              >
                {t("staking.b2")}
              </Button>
              <Button
                onClick={() => {
                  setClaimPopup(true);
                }}
              >
                {t("staking.f2")}
              </Button>
            </StakingSection>
          </div>

          <div className={"flex self-stretch max-tablet:flex-col"}>
            <div className={"flex-1 overflow-x-scroll scrollbar-custom max-tablet:pb-2"}>
              <StakingSupply />
            </div>
            <div className={"w-[20%] max-tablet:w-auto"}>
              <div
                className={"w-[500px] h-[500px] absolute max-tablet:relative -translate-x-[30%] max-tablet:translate-x-0 max-tablet:w-full max-tablet:h-[100vw]"}
              >
                <Image src={"/images/staking.png"} alt={"staking"} fill />
              </div>
            </div>
          </div>
        </div>
      </Main>
    </div>
  );
}
