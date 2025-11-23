"use client";

import { Popup } from "@/app/v2/components/popup";
import { Wallet } from "@/app/v2/components/wallet";
import { ButtonRenewal } from "@/app/v2/components/button-renewal";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useWallet } from "@/app/v2/lib/use-wallet";
import clsx from "clsx";
import Image from "next/image";
import { Network } from "@/app/v2/lib/use-wallet-store";
import { useWalletConnectorStore } from "@/app/v2/lib/use-wallet-connector-store";

export const WalletManagePopup = () => {
  const t = useTranslations();

  const { connect, create, setCreate, setConnect } = useWalletConnectorStore();

  const wallet = useWallet();

  useEffect(() => {
    if (wallet.address) {
      if (connect) {
        setConnect(false);
      }
    }
  }, [wallet.address, connect]);

  const handleCoinClick = (net: Network) => () => {
    wallet.setNetwork(net);
  };

  const [isMobile, setisMobile] = useState(false);
  useEffect(() => {
    setisMobile(
      typeof window !== undefined
        ? /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
        : false
    );
  }, []);

  return (
    <>
      {connect && (
        <Popup
          onClose={() => {
            setConnect(false);
          }}
          title={t("home.presaleJoin2")}
          titleAlign="center"
          showCloseButton={false}
        >
          <div className={"flex flex-col space-y-3"}>
            {!isMobile && (
              <>
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
                  {t("home.presaleJoin3")}
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
                    color: "rgba(120, 121, 124, 1)",
                  }}
                >
                  {t("home.presaleJoin4")}
                </p>
              </>
            )}

            <div
              className={"flex items-center"}
              style={{
                width: "338px",
                height: "54px",
                borderRadius: "12px",
                padding: "4px",
                backgroundColor: "rgba(237, 240, 240, 1)",
                gap: "4px",
              }}
            >
              {[
                ["ETH", "eth.png", "ETH"],
                ["SOL", "sol.png", "SOL"],
                ["BNB", "bnb.png", "BNB"],
              ].map((item) => (
                <button
                  key={item[2]}
                  onClick={handleCoinClick(item[2] as any)}
                  className={"flex items-center justify-center"}
                  style={{
                    width: wallet.network === item[2] ? "110px" : "auto",
                    height: wallet.network === item[2] ? "46px" : "auto",
                    borderRadius: wallet.network === item[2] ? "8px" : "0",
                    padding: wallet.network === item[2] ? "12px" : "0",
                    gap: wallet.network === item[2] ? "8px" : "0",
                    backgroundColor:
                      wallet.network === item[2]
                        ? "rgba(255, 255, 255, 1)"
                        : "transparent",
                    boxShadow:
                      wallet.network === item[2]
                        ? "0px 0px 12px 0px rgba(0, 0, 0, 0.08)"
                        : "none",
                    transition: "all 0.2s",
                    flex: wallet.network === item[2] ? "0 0 110px" : "1",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: wallet.network === item[2] ? 600 : 500,
                      fontSize: "15px",
                      lineHeight: "22px",
                      letterSpacing: "-0.2px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color:
                        wallet.network === item[2]
                          ? "rgba(0, 0, 0, 1)"
                          : "rgba(93, 94, 96, 1)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item[0]}
                  </span>
                </button>
              ))}
            </div>

            {isMobile && (
              <Image
                className={"object-contain mx-auto"}
                src={"/images/mta.png"}
                alt={"mt"}
                width={256}
                height={102}
              />
            )}
            <Wallet type={"connect"} />
            {!isMobile && <Wallet type={"phantom"} />}
            {!isMobile && <Wallet type={"trust"} />}
            <Wallet type={"metamask"} />
            <ButtonRenewal
              onClick={() => {
                setCreate(true);
                setConnect(false);
              }}
              backgroundColor="rgba(224, 225, 229, 1)"
              borderColor="rgba(120, 121, 124, 0.16)"
              textColor="rgba(0, 0, 0, 1)"
              width="100%"
              height="52px"
            >
              I Don't Have a Wallet
            </ButtonRenewal>
            <ButtonRenewal
              onClick={() => {
                setConnect(false);
              }}
              backgroundColor="rgba(47, 47, 49, 1)"
              borderColor="rgba(70, 71, 73, 1)"
              textColor="rgba(255, 255, 255, 1)"
              width="100%"
              height="52px"
            >
              Cancel
            </ButtonRenewal>
          </div>
        </Popup>
      )}

      {create && (
        <Popup
          onClose={() => {
            setCreate(false);
          }}
          title={t("home.noWallet2")}
          titleAlign="center"
          showCloseButton={false}
        >
          <div className={"flex flex-col space-y-3"}>
            {isMobile && (
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
                {t("home.noWallet3")}
                <br />
                <br />
                {t("home.noWallet4")}
                <br />
                {t("home.noWallet5")}
                <br />
                {t("home.noWallet6")}
              </p>
            )}
            {!isMobile && (
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
                Create a wallet and purchase GOTCAR tokens.
              </p>
            )}
            {isMobile && <Wallet create type={"trust"} />}
            {!isMobile && (
              <>
                <Wallet create type={"connect"} />
                <Wallet create type={"phantom"} />
                <Wallet create type={"trust"} />
                <Wallet create type={"metamask"} />
              </>
            )}
            <ButtonRenewal
              onClick={() => {
                setCreate(false);
              }}
              backgroundColor="rgba(47, 47, 49, 1)"
              borderColor="rgba(70, 71, 73, 1)"
              textColor="rgba(255, 255, 255, 1)"
              width="100%"
              height="52px"
            >
              CLOSE
            </ButtonRenewal>
          </div>
        </Popup>
      )}
    </>
  );
};
