"use client";

import { Popup } from "@/components/popup";
import { Wallet } from "@/components/wallet";
import { Button } from "@/components/button";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import { useWallet } from "@/lib/use-wallet";

export const WalletManagePopup = forwardRef((props, ref) => {
  const [create, setCreate] = useState(false);
  const [connect, setConnect] = useState(false);
  const t = useTranslations();

  const wallet = useWallet();

  useEffect(() => {
    if (wallet.address) {
      if (connect) {
        setConnect(false);
      }
    }
  }, [wallet.address, connect]);

  useImperativeHandle(
    ref,
    () => ({
      openConnect: () => setConnect(true),
      openCreate: () => setCreate(true),
    }),
    [],
  );

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
            <p className={"text-center"}>{t("home.presaleJoin3")}</p>
            <p className={"text-center"}>{t("home.presaleJoin4")}</p>
            <Wallet type={"connect"} />
            <Wallet type={"phantom"} />
            <Wallet type={"trust"} />
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
            <Wallet create type={"connect"} />
            <Wallet create type={"phantom"} />
            <Wallet create type={"trust"} />
            <Wallet create type={"metamask"} />
          </div>
        </Popup>
      )}
    </>
  );
});
