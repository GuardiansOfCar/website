"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import NextLink from "next/link";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { Button } from "@/components/button";
import { useWallet } from "@/lib/use-wallet";
import { shortenAddress } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";
import { useWalletConnectorStore } from "@/lib/use-wallet-connector-store";
import { useParams, useSearchParams } from "next/navigation";

export const Nav = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const wallet = useWallet();

  const [langOpened, setLangOpened] = useState(false);
  const handleLangClick = () => {
    setLangOpened(!langOpened);
  };

  const handleBuyGocarClick = () => {
    if (wallet.address) {
      wallet.disconnect();
    } else {
      walletConnectorStore.setConnect(true);
    }
  };

  const listNav = (
    <ul className={"flex items-center gap-2"}>
      {[
        { label: t("home.nav1"), href: "/" },
        { label: t("home.nav6"), href: "/staking" },
        { label: t("home.nav7"), href: "/referral" },
      ].map((nav, index) => {
        return (
          <li key={index}>
            <Link
              onClick={() => {
                setMenuOpen(false);
              }}
              href={nav.href}
              className={clsx(
                "block py-2 px-3 text-body-1b text-neutral-100 cursor-pointer hover:text-primary transition-colors",
                "max-desktop:px-5 max-desktop:py-5 max-desktop:justify-between",
                pathname.endsWith(nav.href) && "text-primary"
              )}
            >
              {nav.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const params = useParams();
  const selected = params.locale;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderLanguage = (isMobile?: boolean) => {
    return (
      <div className={"relative max-desktop:w-full"}>
        <button
          onClick={handleLangClick}
          className={clsx(
            "py-2 px-3 text-body-1b flex items-center gap-2 text-neutral-100 hover:text-primary transition-colors",
            langOpened && "!text-primary",
            "max-desktop:px-5 max-desktop:py-5 max-desktop:justify-between max-desktop:w-full"
          )}
        >
          <Image
            src={"/images/gear.png"}
            alt={"Language"}
            width={16}
            height={16}
            className={"object-contain"}
          />
          {String(selected).toUpperCase()}
          <Image
            width={12}
            height={6}
            src={
              langOpened
                ? "/images/chervon-down-primary.png"
                : "/images/chervon-down.png"
            }
            alt={"chervon-down.png"}
          />
        </button>
        {langOpened && (
          <div
            style={
              isMobile
                ? {}
                : {
                    right: "calc((100% - 1312px) / 2)",
                    top: isScrolled ? 0 : 66,
                  }
            }
            className={
              "bg-[rgba(7,20,25,0.95)] backdrop-blur-md z-[9999] fixed rounded-lg border border-neutral-60/20 max-desktop:!relative max-desktop:top-0"
            }
          >
            <div
              className={
                "w-full flex flex-col items-center relative z-[10] py-2"
              }
            >
              {LANGUAGES.map((chapter) => {
                // 현재 URL 파라미터를 유지하면서 언어만 변경
                const currentSearch = searchParams.toString();
                const newHref = `/${chapter.key}${currentSearch ? `?${currentSearch}` : ""}`;

                return (
                  <NextLink
                    onClick={() => {
                      setLangOpened(false);
                      setMenuOpen(false);
                    }}
                    key={chapter.key}
                    href={newHref}
                    className={clsx(
                      "flex text-left w-full py-3 text-body-1b text-neutral-100 hover:text-primary cursor-pointer transition-colors",
                      pathname.endsWith(`/${chapter.key}`) && "!text-primary",
                      "px-4 max-desktop:px-8 max-desktop:py-4 max-desktop:w-full"
                    )}
                  >
                    <span className={"mr-2 block emoji-font !font-normal"}>
                      {chapter.code}
                    </span>
                    {chapter.label}
                  </NextLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const listTools = (
    <div>
      <div className={"hidden max-desktop:flex"}>{renderLanguage(true)}</div>
      <div
        className={
          "flex items-center gap-2 max-desktop:grid max-desktop:grid-cols-2 max-desktop:space-x-0 max-desktop:gap-3 max-desktop:px-5 max-desktop:py-4 border-b-primary  max-desktop:border-b-[4px]"
        }
      >
        <a
          className={
            "cursor-pointer w-6 h-6 relative flex items-center justify-center"
          }
          target={"_blank"}
          href={"https://x.com/gotcar_official"}
        >
          <Image
            className={"max-desktop:hidden"}
            src={"/images/x.png"}
            width={24}
            height={24}
            alt={"X (Twitter)"}
          />
          <Image
            className={"hidden max-desktop:block"}
            src={"/images/x2.png"}
            width={24}
            height={24}
            alt={"X (Twitter)"}
          />
        </a>

        <a
          className={
            "cursor-pointer w-6 h-6 relative flex items-center justify-center"
          }
          target={"_blank"}
          href={"https://t.me/GOTCAR_Official"}
        >
          <Image
            className={"max-desktop:hidden"}
            src={"/images/telegram.png"}
            width={24}
            height={24}
            alt={"Telegram"}
          />
          <Image
            className={"hidden max-desktop:block"}
            src={"/images/tel2.png"}
            width={24}
            height={24}
            alt={"Telegram"}
          />
        </a>

        <NextLink href={"/whitepaper.pdf"} target={"_blank"}>
          <button
            className={
              "bg-neutral-60 hover:bg-neutral-40 text-neutral-100 px-4 py-2 rounded-lg flex items-center gap-2 text-body-1b transition-colors max-desktop:w-full"
            }
          >
            {t("home.docs1") || "DOCS"}
            <Image
              src={"/images/up.png"}
              width={12}
              height={12}
              alt={"External link"}
              className={"rotate-45"}
            />
          </button>
        </NextLink>

        <Button
          onClick={handleBuyGocarClick}
          size={"sm"}
          className={"max-desktop:col-span-2"}
        >
          {wallet.address
            ? shortenAddress(wallet.address)
            : t("home.presaleJoin2")}
        </Button>

        <div className={"max-desktop:hidden flex items-center"}>
          {renderLanguage()}
        </div>
      </div>
    </div>
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const walletConnectorStore = useWalletConnectorStore();

  const handleMenuClick = () => {
    setMenuOpen((p) => !p);
  };
  return (
    <nav
      className={clsx(
        "w-[1312px] max-w-[1312px] h-[66px] mx-auto",
        "bg-[rgba(7,20,25,0.8)] backdrop-blur-[8px]",
        "rounded-2xl border-b border-neutral-60/20",
        "pt-3 px-6 pb-3",
        "flex items-center justify-between gap-2",
        "max-desktop:max-w-full max-desktop:w-full max-desktop:rounded-none max-desktop:border-b-0 max-desktop:bg-black max-desktop:backdrop-blur-none"
      )}
    >
      <Link href={"/"} className={"flex items-center gap-2"}>
        <div
          className={
            "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
          }
        >
          <span className={"text-primary text-lg font-bold"}>G</span>
        </div>
        <h1 className={clsx("text-header-3 text-primary font-bold")}>GOTCAR</h1>
      </Link>
      <div className={"max-desktop:hidden"}>{listNav}</div>

      <div className={"max-desktop:hidden"}>{listTools}</div>

      <button className={"hidden max-desktop:block"} onClick={handleMenuClick}>
        <Image
          src={menuOpen ? "/images/menu-close.png" : "/images/menu.png"}
          alt={"menu"}
          width={24}
          height={24}
        />
      </button>

      <div
        className={clsx(
          menuOpen ? "block" : "hidden",
          "fixed top-[94px] right-0 left-0 bottom-0 z-[50] bg-[rgba(0,0,0,0.5)] pb-[100px]"
        )}
      >
        {menuOpen && <A />}
        <div className={"bg-black max-h-[100vh] overflow-y-auto"}>
          {listNav}
          {listTools}
        </div>
      </div>
    </nav>
  );
};

const A = () => {
  useLockBodyScroll();
  return null;
};
