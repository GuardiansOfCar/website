"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { Button } from "@/components/button";
import { useWallet } from "@/lib/use-wallet";
import { shortenAddress } from "@/lib/utils";

export const Nav = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const [chapterOpened, setChapterOpened] = useState(false);
  const chapterRef = useClickAway<HTMLDivElement>(() => {
    setChapterOpened(false);
  });

  const wallet = useWallet();

  const handleChapterClick = () => {
    setChapterOpened(!chapterOpened);
  };

  const chapterFocused = chapterOpened || pathname.startsWith("/chapters");

  const router = useRouter();
  const handleBuyGocarClick = () => {
    if (wallet.address) {
      wallet.clear();
    } else {
      router.push("/");
    }
  };
  return (
    <div className={"w-full text-neutral-100"}>
      <nav
        className={
          "w-full max-w-[var(--max-width)] h-[72px] mx-auto flex items-center justify-between px-10"
        }
      >
        <Link href={"/public"}>
          <h1 className={clsx("text-header-3 text-primary")}>
            GUARDIANS OF THE CAR
          </h1>
        </Link>
        <ul className={"flex items-center"}>
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
                        ref={chapterRef}
                        className={
                          "bg-black z-10 absolute top-[100%] left-0 right-0"
                        }
                      >
                        <div className={"w-full flex flex-col items-center"}>
                          {[1, 2, 3, 4].map((chapter) => {
                            return (
                              <Link
                                onClick={() => {
                                  setChapterOpened(false);
                                }}
                                key={chapter}
                                href={`${nav.href}/${chapter}`}
                                className={clsx(
                                  "text-center flex py-2 text-body-1b text-white hover:text-primary cursor-pointer",
                                  pathname.endsWith(`${nav.href}/${chapter}`) &&
                                    "!text-primary",
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
                    href={nav.href}
                    className={clsx(
                      "py-3 px-2 text-body-1b cursor-pointer",
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

        <div className={"flex space-x-3"}>
          <a
            className={"cursor-pointer"}
            target={"_blank"}
            href={"https://x.com/gocar_official"}
          >
            <Image src={"/images/x.png"} width={48} height={48} alt={"x"} />
          </a>

          <a
            className={"cursor-pointer"}
            target={"_blank"}
            href={"https://t.me/Gocar_Official"}
          >
            <Image
              src={"/images/telegram.png"}
              width={48}
              height={48}
              alt={"telegram"}
            />
          </a>

          <Button size={"sm"} className={"!bg-neutral-60"}>
            {t("home.whitepaper1")}
          </Button>

          <Button onClick={handleBuyGocarClick} size={"sm"} className={""}>
            {wallet.address
              ? shortenAddress(wallet.address)
              : t("home.buyToken1")}
          </Button>
        </div>
      </nav>
    </div>
  );
};
