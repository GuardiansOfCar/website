"use client";

import { Popup } from "@/components/popup";
import { Wallet } from "@/components/wallet";
import { Button } from "@/components/button";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useWallet } from "@/lib/use-wallet";
import clsx from "clsx";
import Image from "next/image";
import { Network } from "@/lib/use-wallet-store";
import { useWalletConnectorStore } from "@/lib/use-wallet-connector-store";

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
        : false,
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
        >
          <div className={"flex flex-col space-y-3"}>
            {!isMobile && (
              <>
                <p className={"text-center"}>{t("home.presaleJoin3")}</p>
                <p className={"text-center"}>{t("home.presaleJoin4")}</p>
              </>
            )}


            <div className={"flex items-center space-x-2 self-stretch pb-2"}>
              {[
                ["ETH", "eth.png", "ETH"],
                ["SOL", "sol.png", "SOL"],
                ["BNB", "bnb.png", "BNB"],
              ].map((item) => (
                <button
                  key={item[2]}
                  onClick={handleCoinClick(item[2] as any)}
                  className={clsx(
                    "flex items-center px-[30px] py-2 space-x-2 max-tablet:px-2 flex-1",
                    wallet.network === item[2]
                      ? "bg-neutral-0"
                      : "bg-neutral-80",
                  )}
                >
                  <Image
                    src={`/images/${item[1]}`}
                    alt={item[2]}
                    width={24}
                    height={24}
                  />
                  <span
                    className={clsx(
                      "text-body-3",
                      wallet.network === item[2] && "text-neutral-100",
                    )}
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
            <Button
              className={"!bg-neutral-40"}
              onClick={() => {
                setCreate(true);
                setConnect(false);
              }}
            >
              {t("home.presaleJoin5")}
            </Button>
          </div>
        </Popup>
      )}

      {create && (
        <Popup
          onClose={() => {
            setCreate(false);
          }}
          title={t("home.noWallet2")}
        >
          <div className={"flex flex-col space-y-3"}>
            {isMobile && (
              <p className={"text-body-3 text-center"}>
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
              <p className={"text-body-3 text-center"}>
                Create a wallet and purchase GOCAR tokens.
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
            <Button
              className={"!bg-neutral-40"}
              onClick={() => {
                setCreate(false);
              }}
            >
              CLOSE
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};
