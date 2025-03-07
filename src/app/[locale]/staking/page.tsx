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

  useEffect(() => {
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

  useEffect(() => {
    if (!wallet.id) return;

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
  }, [wallet.id]);

  useEffect(() => {
    if (!wallet.id) return;

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
  }, [wallet.id]);

  const [reward, setReward] = useState("");

  useEffect(() => {
    if (!wallet.id) return;

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
  }, [wallet.id]);

  const handleClaim = async () => {
    fetch(`${API_BASE_URL}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userWalletId: wallet.id,
        amount: reward,
        otpCode: "string",
      }),
    });
  };

  return (
    <>
      {buyPopup && (
        <Popup onClose={handleBuyPopupClose} title={t("staking.c4")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p className={"text-center text-body-3"}>{t("staking.c2")}</p>
              <span className={"text-header-3"}>
                2{" "}
                <span className={"text-header-3 text-primary-10"}>$GOCAR</span>
              </span>
            </div>

            <div className={"space-y-1"}>
              <div className={"flex items-center justify-between"}>
                <p className={"text-body-3"}>{t("staking.c6")}</p>
                <p className={"text-body-3b"}>{t("staking.c7")}</p>
              </div>
              <div className={"bg-[#CDE7E5] flex"}>
                <input
                  className={
                    "py-3 px-2 bg-transparent text-body-2 rounded-none flex-1"
                  }
                />
                <span className={"m-4 text-title-1 text-primary-0"}>
                  $GOCAR
                </span>
              </div>
            </div>

            <Button>{t("staking.c8")}</Button>
            <Button
              onClick={() => {
                setStakePopup(true);
                handleBuyPopupClose();
              }}
            >
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
                2{" "}
                <span className={"text-header-3 text-primary-10"}>$GOCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center"}>
              {t("staking.b3")} {t("staking.b4")}
            </p>

            <Button>{t("staking.c13")}</Button>
          </div>
        </Popup>
      )}

      {stakePopup && (
        <Popup onClose={handleStakePopupClose} title={t("staking.c9")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p className={"text-center text-body-3"}>{t("staking.c2")}</p>
              <span className={"text-header-3"}>
                2{" "}
                <span className={"text-header-3 text-primary-10"}>$GOCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center"}>{t("staking.c11")}</p>

            <Button>{t("staking.c12")}</Button>
            <Button className={"!bg-neutral-40"}>{t("staking.c13")}</Button>
          </div>
        </Popup>
      )}

      {claimPopup && (
        <Popup onClose={handleClaimPopupClose} title={t("staking.f3")}>
          <div className={"flex flex-col space-y-3"}>
            <div className={"flex flex-col items-center"}>
              <p className={"text-center text-body-3"}>{t("staking.c2")}</p>
              <span className={"text-header-3"}>
                {reward}{" "}
                <span className={"text-header-3 text-primary-10"}>$GOCAR</span>
              </span>
            </div>

            <p className={"text-body-3 text-center"}>{t("staking.f4")}</p>
            <p className={"text-body-3 text-center text-[#CF1C1C]"}>
              {t("staking.f5")}
            </p>

            <Button onClick={handleClaim}>CLAIM</Button>
            <Button
              onClick={handleClaimPopupClose}
              className={"!bg-neutral-40"}
            >
              {t("staking.c13")}
            </Button>
          </div>
        </Popup>
      )}

      <Main leftHref={"/howtobuy"} rightHref={"/faq"}>
        <div className={"flex flex-col space-y-8 items-start px-10"}>
          <div className={"flex flex-col space-y-4"}>
            <h2 className={"text-header-2 text-primary"}>{t("staking.a1")}</h2>
            <p className={"text-body-3 text-neutral-100"}>{t("staking.a2")}</p>
          </div>

          <div className={"grid grid-cols-4 gap-x-5 self-stretch"}>
            <StakingSection
              title={t("staking.c1")}
              headerBorder
              description={
                <>
                  <span>
                    {status.stakedBalance}{" "}
                    <span className={"text-primary-10"}>$GOCAR</span>
                  </span>
                </>
              }
            >
              <div className={""}>
                <span className={"text-body-3"}>{t("staking.c2")}</span>
                <div className={"text-title-1b"}>
                  <span>
                    {status.availableBalance}{" "}
                    <span className={"text-primary-10"}>$GOCAR</span>
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
                    {total.totalStaked}{" "}
                    <span className={"text-primary-10"}>$GOCAR</span>
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
                    {reward} <span className={"text-primary-10"}>$GOCAR</span>
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

          <div className={"flex self-stretch"}>
            <div className={"flex-1"}>
              <StakingSupply />
            </div>
            <div className={"w-[20%] self-end"}>
              <Image
                className={"mx-auto"}
                src={"/images/staking.png"}
                alt={"staking"}
                width={150}
                height={422}
              />
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}
