"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import NextLink from "next/link";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useRef, useState } from "react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { Button } from "@/components/button";
import { useWallet } from "@/lib/use-wallet";
import { shortenAddress } from "@/lib/utils";
import { AUDIT_LINK } from "@/lib/constants";
import { useWalletConnectorStore } from "@/lib/use-wallet-connector-store";

export const Nav = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const [chapterOpened, setChapterOpened] = useState(false);

  const wallet = useWallet();

  const handleChapterClick = () => {
    console.log("dw");
    setChapterOpened(!chapterOpened);
  };

  const chapterFocused = chapterOpened || pathname.startsWith("/chapters");

  const walletManageRef = useRef<any>(null);
  const handleBuyGocarClick = () => {
    if (wallet.address) {
      wallet.disconnect();
    } else {
      walletConnectorStore.setConnect(true);
    }
  };

  const listNav = (
    <ul
      className={
        "flex items-center max-desktop:flex-col max-desktop:items-stretch"
      }
    >
      {[
        { label: t("home.nav1"), href: "/" },
        { label: t("home.nav2"), href: "/chapters" },
        { label: t("home.nav3"), href: "/howtobuy" },
        {
          label: t("home.nav4"),
          href: "/roadmap",
        },
        { label: t("home.nav5"), href: "/faq" },
        { label: t("home.nav6"), href: "/staking" },
        { label: t("home.nav7"), href: "/referral" },
        { label: t("home.nav8"), href: "/g2e" },
      ].map((nav, index) => {
        return (
          <li key={index}>
            {nav.href === "/chapters" && (
              <div className={"relative"}>
                <button
                  onClick={handleChapterClick}
                  className={clsx(
                    "py-2 px-3 text-body-1b flex items-center gap-x-2",
                    chapterFocused && "text-primary",
                    "max-desktop:px-5 max-desktop:py-5 max-desktop:justify-between max-desktop:w-full",
                  )}
                >
                  {nav.label}
                  <Image
                    width={12}
                    height={6}
                    src={
                      chapterFocused
                        ? "/images/chervon-down-primary.png"
                        : "/images/chervon-down.png"
                    }
                    alt={"chervon-down.png"}
                  />
                </button>
                {chapterOpened && (
                  <div
                    className={
                      "bg-black z-[9999] absolute top-[100%] left-0 right-0 max-desktop:relative max-desktop:top-0"
                    }
                  >
                    <div
                      className={
                        "w-full flex flex-col items-center relative z-[10]"
                      }
                    >
                      {[1, 2, 3, 4].map((chapter) => {
                        return (
                          <Link
                            onClick={() => {
                              setChapterOpened(false);
                              setMenuOpen(false);
                            }}
                            key={chapter}
                            href={`${nav.href}/${chapter}`}
                            className={clsx(
                              "text-center flex py-2 text-body-1b text-white hover:text-primary cursor-pointer",
                              pathname.endsWith(`${nav.href}/${chapter}`) &&
                                "!text-primary",
                              "max-desktop:px-8 max-desktop:py-4 max-desktop:w-full",
                            )}
                          >
                            {t(`chapter.chapterMenu${chapter}`)}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {nav.href !== "/chapters" && (
              <Link
                onClick={() => {
                  setMenuOpen(false);
                }}
                href={nav.href}
                className={clsx(
                  "block py-3 px-2 text-body-1b cursor-pointer",
                  "max-desktop:px-5 max-desktop:py-5 max-desktop:justify-between",
                  pathname.endsWith(nav.href) && "text-primary",
                )}
              >
                {nav.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  const listTools = (
    <div
      className={
        "flex space-x-3 max-desktop:grid max-desktop:grid-cols-2 max-desktop:space-x-0 max-desktop:gap-3 max-desktop:px-5 max-desktop:py-4 border-b-primary  max-desktop:border-b-[4px]"
      }
    >
      <a
        className={
          "cursor-pointer w-12 h-12 max-desktop:h-[50px] relative max-desktop:w-full max-desktop:bg-[rgb(66,127,134)] max-desktop:border-4 max-desktop:border-black items-center justify-center max-desktop:flex"
        }
        target={"_blank"}
        href={AUDIT_LINK}
      >
        <Image
          className={"max-desktop:hidden"}
          src={"/images/audit.png"}
          fill
          alt={"audit"}
        />
        <span className={"text-xl shadow-text hidden max-desktop:block"}>
          AUDIT
        </span>
      </a>
      <a
        className={"cursor-pointer w-12 h-12 relative max-desktop:w-full"}
        target={"_blank"}
        href={"https://x.com/gocar_official"}
      >
        <Image
          className={"max-desktop:hidden"}
          src={"/images/x.png"}
          fill
          alt={"x"}
        />
        <Image
          className={"hidden max-desktop:block"}
          src={"/images/x2.png"}
          fill
          alt={"x"}
        />
      </a>

      <a
        className={"cursor-pointer w-12 h-12 relative max-desktop:w-full"}
        target={"_blank"}
        href={"https://t.me/Gocar_Official"}
      >
        <Image
          className={"max-desktop:hidden"}
          src={"/images/telegram.png"}
          fill
          alt={"telegram"}
        />
        <Image
          className={"hidden max-desktop:block"}
          src={"/images/tel2.png"}
          fill
          alt={"x"}
        />
      </a>

      <NextLink href={"/whitepaper.pdf"} target={"_blank"}>
        <Button size={"sm"} className={"!bg-neutral-60 max-desktop:w-full"}>
          {t("home.whitepaper1")}
        </Button>
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
    </div>
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const walletConnectorStore = useWalletConnectorStore();

  const handleMenuClick = () => {
    setMenuOpen((p) => !p);
  };
  return (
    <div className={"w-full text-neutral-100 relative z-10"}>
      <nav
        className={
          "w-full max-w-[var(--max-width)] h-[72px] mx-auto flex items-center justify-between px-10 max-desktop:px-5"
        }
      >
        <Link href={"/"}>
          <h1 className={clsx("text-header-3 text-primary")}>
            GUARDIANS OF THE CAR
          </h1>
        </Link>
        <div className={"max-desktop:hidden"}>{listNav}</div>

        <div className={"max-desktop:hidden"}>{listTools}</div>

        <button
          className={"hidden max-desktop:block"}
          onClick={handleMenuClick}
        >
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
            "fixed top-[76px] right-0 left-0 bottom-0 z-[50] bg-[rgba(0,0,0,0.5)] pb-[100px]",
          )}
        >
          {menuOpen && <A />}
          <div className={"bg-black max-h-[100vh] overflow-y-auto"}>
            {listNav}
            {listTools}
          </div>
        </div>
      </nav>
    </div>
  );
};

const A = () => {
  useLockBodyScroll();
  return null;
};
