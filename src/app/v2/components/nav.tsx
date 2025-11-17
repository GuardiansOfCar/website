"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname } from "@/app/v2/i18n/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { useWallet } from "@/app/v2/lib/use-wallet";
import { shortenAddress } from "@/app/v2/lib/utils";
import { LANGUAGES } from "@/app/v2/lib/constants";
import { useWalletConnectorStore } from "@/app/v2/lib/use-wallet-connector-store";
import { useParams, useSearchParams } from "next/navigation";

export const Nav = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const wallet = useWallet();

  // 현재 경로를 클라이언트 사이드에서 가져오기
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updatePath = () => {
        setCurrentPath(window.location.pathname);
      };

      // 초기 경로 설정
      updatePath();

      // 경로 변경 감지를 위한 이벤트 리스너
      window.addEventListener("popstate", updatePath);

      // Next.js 라우터 이벤트 감지
      const handleRouteChange = () => {
        updatePath();
      };

      // pathname이 변경될 때마다 업데이트
      updatePath();

      return () => {
        window.removeEventListener("popstate", updatePath);
      };
    }
  }, [pathname]);

  // Staking이나 Referral 페이지인지 확인
  const isLightMode =
    currentPath.startsWith("/v2/") &&
    (currentPath.includes("/staking") || currentPath.includes("/referral"));

  const [langOpened, setLangOpened] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const handleLangClick = () => {
    setLangOpened(!langOpened);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangOpened(false);
      }
    };

    if (langOpened) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langOpened]);

  const handleBuyGocarClick = () => {
    if (wallet.address) {
      wallet.disconnect();
    } else {
      walletConnectorStore.setConnect(true);
    }
  };

  const params = useParams();
  const selected = params.locale as string;

  const listNav = (
    <ul className={"flex items-center"} style={{ gap: "48px" }}>
      {[
        {
          label: t("home.nav1"),
          href: (selected === "en"
            ? "/v2/en"
            : selected === "zh-CN"
              ? "/v2/zh-CN"
              : "/v2/ja") as "/v2/en" | "/v2/zh-CN" | "/v2/ja",
          isHome: true,
        },
        {
          label: t("home.nav6"),
          href: (selected === "en"
            ? "/v2/en/staking"
            : selected === "zh-CN"
              ? "/v2/zh-CN/staking"
              : "/v2/ja/staking") as
            | "/v2/en/staking"
            | "/v2/zh-CN/staking"
            | "/v2/ja/staking",
        },
        {
          label: t("home.nav7"),
          href: (selected === "en"
            ? "/v2/en/referral"
            : selected === "zh-CN"
              ? "/v2/zh-CN/referral"
              : "/v2/ja/referral") as
            | "/v2/en/referral"
            | "/v2/zh-CN/referral"
            | "/v2/ja/referral",
        },
      ].map((nav, index) => {
        // 현재 경로와 비교 (클라이언트 사이드 경로 사용)
        const actualPathname =
          currentPath ||
          (typeof window !== "undefined" ? window.location.pathname : "");
        const isActive = nav.isHome
          ? actualPathname === nav.href || actualPathname === nav.href + "/"
          : actualPathname === nav.href ||
            actualPathname.startsWith(nav.href + "/");
        const LinkComponent = NextLink;
        return (
          <li key={index}>
            <LinkComponent
              onClick={() => {
                setMenuOpen(false);
              }}
              href={nav.href as any}
              className={clsx(
                "block py-2 px-3 cursor-pointer transition-colors",
                "max-desktop:px-5 max-desktop:py-5 max-desktop:justify-between",
                "align-middle"
              )}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontWeight: isActive ? 700 : 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: isActive
                  ? isLightMode
                    ? "#0F0F0F"
                    : "#FFFFFF"
                  : isLightMode
                    ? "#28282A"
                    : "#E0E1E5",
              }}
            >
              {nav.label}
            </LinkComponent>
          </li>
        );
      })}
    </ul>
  );

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
      <div className={"relative"} ref={langDropdownRef}>
        <button
          onClick={handleLangClick}
          className={clsx(
            "py-2 px-3 flex items-center gap-2 hover:text-primary transition-colors",
            langOpened && "!text-primary",
            isMobile && "px-2 py-2",
            !isMobile &&
              "max-desktop:px-5 max-desktop:py-5 max-desktop:justify-between max-desktop:w-full",
            "align-middle"
          )}
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontWeight: 400,
            fontSize: "15px",
            lineHeight: "22px",
            color: isLightMode ? "#0F0F0F" : "#FFFFFF",
          }}
        >
          <Image
            src={
              isLightMode
                ? "/images/language-icon-black.png"
                : "/images/language-icon.png"
            }
            alt={"Language Settings"}
            title={"Change Language"}
            width={18}
            height={18}
            className={"object-contain"}
            loading={"lazy"}
          />
          {String(selected).toUpperCase()}
          <Image
            width={12}
            height={6}
            src={
              langOpened
                ? "/images/chervon-down-primary.png"
                : isLightMode
                  ? "/images/chervon-down-black.png"
                  : "/images/chervon-down.png"
            }
            alt={langOpened ? "Close language menu" : "Open language menu"}
            title={langOpened ? "Close language menu" : "Open language menu"}
            loading={"lazy"}
            style={
              isLightMode && !langOpened
                ? {
                    filter:
                      "brightness(0) saturate(100%) invert(47%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                  }
                : {}
            }
          />
        </button>
        {langOpened && (
          <div
            style={{
              right: 0,
              top: "100%",
              marginTop: "8px",
              left: "auto",
              backgroundColor: isLightMode
                ? "rgba(255,255,255,0.95)"
                : "rgba(7,20,25,0.95)",
            }}
            className={
              "backdrop-blur-md z-[9999] absolute rounded-lg border border-neutral-60/20"
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
                      "flex text-left w-full py-3 text-body-1b hover:text-primary cursor-pointer transition-colors",
                      pathname.endsWith(`/${chapter.key}`) && "!text-primary",
                      "px-4 max-desktop:px-8 max-desktop:py-4 max-desktop:w-full"
                    )}
                    style={{
                      color: isLightMode ? "#0F0F0F" : "#FFFFFF",
                    }}
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
      {/* 모바일에서는 헤더에 표시되므로 여기서는 숨김 */}
      <div className={"hidden"}>{renderLanguage(true)}</div>
      <div
        className={
          "flex items-center max-desktop:grid max-desktop:grid-cols-2 max-desktop:space-x-0 max-desktop:gap-3 max-desktop:px-5 max-desktop:py-4 border-b-primary  max-desktop:border-b-[4px]"
        }
      >
        <a
          className={
            "cursor-pointer w-6 h-6 relative flex items-center justify-center"
          }
          target={"_blank"}
          rel={"noopener noreferrer"}
          href={"https://x.com/gotcar_official"}
          aria-label={"Follow GOTCAR on X (Twitter)"}
        >
          <Image
            src={
              isLightMode ? "/images/x-icon-black.png" : "/images/x-icon.png"
            }
            width={24}
            height={24}
            alt={"Follow GOTCAR on X (Twitter)"}
            title={"GOTCAR Official X (Twitter) Account"}
            loading={"lazy"}
          />
        </a>

        <a
          className={
            "cursor-pointer w-6 h-6 relative flex items-center justify-center"
          }
          style={{ marginLeft: "16px" }}
          target={"_blank"}
          rel={"noopener noreferrer"}
          href={"https://t.me/Gotcar_Official"}
          aria-label={"Join GOTCAR Telegram Community"}
        >
          <Image
            src={
              isLightMode
                ? "/images/telegram-icon-black.png"
                : "/images/telegram-icon.png"
            }
            width={24}
            height={24}
            alt={"Join GOTCAR Telegram Community"}
            title={"GOTCAR Official Telegram Channel"}
            loading={"lazy"}
          />
        </a>

        <div className={"max-desktop:hidden"} style={{ marginLeft: "16px" }}>
          {renderLanguage()}
        </div>

        <NextLink
          href={"/whitepaper.pdf"}
          target={"_blank"}
          rel={"noopener noreferrer"}
          style={{ marginLeft: "16px" }}
        >
          <button
            className={clsx(
              "flex items-center justify-center gap-2",
              "bg-[#2F2F31] rounded-xl",
              "text-[#FFFFFF] font-bold text-sm leading-[22px] text-center align-middle",
              "w-[80px] h-[42px]",
              "max-desktop:w-full"
            )}
            style={{
              fontFamily: "Pretendard, sans-serif",
              paddingTop: "9px",
              paddingRight: "8px",
              paddingBottom: "9px",
              paddingLeft: "14px",
            }}
          >
            <span>{t("home.docs1")}</span>
            <Image
              src={"/images/docs-arrow.png"}
              width={8}
              height={8}
              alt={"Open GOTCAR documentation"}
              title={"GOTCAR Documentation - Whitepaper"}
              className={"object-contain"}
              loading={"lazy"}
            />
          </button>
        </NextLink>

        <button
          onClick={handleBuyGocarClick}
          className={clsx(
            "max-desktop:col-span-2",
            "flex items-center justify-center gap-2",
            "bg-primary rounded-xl",
            "text-[#0F0F0F] font-bold text-sm leading-[22px] text-center align-middle",
            "w-[129px] h-[42px] py-[10px] px-[14px]"
          )}
          style={{
            fontFamily: "Pretendard, sans-serif",
            marginLeft: "12px",
          }}
        >
          {wallet.address
            ? shortenAddress(wallet.address)
            : t("home.presaleJoin2")}
        </button>
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
        "backdrop-blur-[8px]",
        "rounded-2xl border-b border-neutral-60/20",
        "pt-3 px-6 pb-3",
        "flex items-center",
        "max-desktop:max-w-[calc(100%-32px)] max-desktop:w-[calc(100%-32px)] max-desktop:mx-4 max-desktop:rounded-2xl max-desktop:border-b-0 max-desktop:bg-black max-desktop:backdrop-blur-none max-desktop:justify-between max-desktop:pt-4 max-desktop:px-4 max-desktop:pb-[19px]"
      )}
      style={{
        backgroundColor: isLightMode ? "white" : "rgba(7,20,25,0.8)",
      }}
    >
      <NextLink
        href={
          selected === "en"
            ? "/v2/en"
            : selected === "zh-CN"
              ? "/v2/zh-CN"
              : "/v2/ja"
        }
        className={
          "flex items-center flex-shrink-0 gap-2 max-desktop:gap-[6px]"
        }
      >
        <Image
          src={
            isLightMode ? "/images/logo-black.png" : "/images/gotcar-logo.png"
          }
          alt={"GOTCAR Logo - AI-Powered Mobility Ecosystem"}
          title={"GOTCAR - Guardians Of The Car"}
          width={24}
          height={24}
          className={"object-contain max-desktop:w-[18px] max-desktop:h-[18px]"}
          loading={"eager"}
          fetchPriority={"high"}
        />
        <Image
          src={
            isLightMode
              ? "/images/gotcar-text-black.png"
              : "/images/gotcar-text.png"
          }
          alt={"GOTCAR - Guardians Of The Car"}
          title={"GOTCAR - AI-Powered Mobility Ecosystem"}
          width={117}
          height={20}
          className={"object-contain max-desktop:w-[88px] max-desktop:h-[15px]"}
          loading={"eager"}
          fetchPriority={"high"}
        />
      </NextLink>
      <div
        className={"max-desktop:hidden flex-1"}
        style={{ marginLeft: "40px" }}
      >
        {listNav}
      </div>

      <div className={"max-desktop:hidden flex-shrink-0"}>{listTools}</div>

      {/* 모바일: 언어 선택기 + 햄버거 메뉴 */}
      <div
        className={"hidden max-desktop:flex items-center gap-4 flex-shrink-0"}
      >
        <div className={"relative"}>{renderLanguage(true)}</div>
        <button
          onClick={handleMenuClick}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          <Image
            src={menuOpen ? "/images/menu-close.png" : "/images/menu.png"}
            alt={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            title={menuOpen ? "Close menu" : "Open menu"}
            width={24}
            height={24}
            className={"object-contain"}
            style={{
              filter: isLightMode ? "brightness(0)" : "brightness(0) invert(1)",
            }}
            loading={"lazy"}
          />
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <>
          <A />
          {/* 배경 오버레이 */}
          <div
            className={"fixed inset-0 z-[40] max-desktop:block hidden"}
            style={{
              backgroundColor: "transparent",
            }}
            onClick={() => setMenuOpen(false)}
          />
          {/* 모바일용 네비게이션 목록 */}
          <ul
            className={clsx(
              "fixed z-[50] hidden max-desktop:block",
              "top-[94px] flex flex-col"
            )}
            style={{
              // height: "376px",
              width: "402px",
              maxWidth: "calc(100vw - 32px)",
              left: "16px",
              borderRadius: "16px",
              boxShadow: "0px 0px 12px 0px rgba(28, 32, 33, 0.04)",
              gap: "0",
              marginBottom: "16px",
              overflowY: "auto",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {[
              {
                label: t("home.nav1"),
                href: (selected === "en"
                  ? "/v2/en"
                  : selected === "zh-CN"
                    ? "/v2/zh-CN"
                    : "/v2/ja") as "/v2/en" | "/v2/zh-CN" | "/v2/ja",
                isHome: true,
              },
              {
                label: t("home.nav6"),
                href: (selected === "en"
                  ? "/v2/en/staking"
                  : selected === "zh-CN"
                    ? "/v2/zh-CN/staking"
                    : "/v2/ja/staking") as
                  | "/v2/en/staking"
                  | "/v2/zh-CN/staking"
                  | "/v2/ja/staking",
              },
              {
                label: t("home.nav7"),
                href: (selected === "en"
                  ? "/v2/en/referral"
                  : selected === "zh-CN"
                    ? "/v2/zh-CN/referral"
                    : "/v2/ja/referral") as
                  | "/v2/en/referral"
                  | "/v2/zh-CN/referral"
                  | "/v2/ja/referral",
              },
            ].map((nav, index) => {
              // 현재 경로와 비교 (클라이언트 사이드 경로 사용)
              const actualPathname =
                currentPath ||
                (typeof window !== "undefined" ? window.location.pathname : "");
              const isActive = nav.isHome
                ? actualPathname === nav.href ||
                  actualPathname === nav.href + "/"
                : actualPathname === nav.href ||
                  actualPathname.startsWith(nav.href + "/");
              const LinkComponent = NextLink;
              return (
                <li key={index}>
                  <LinkComponent
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    href={nav.href as any}
                    className={clsx(
                      "block cursor-pointer transition-all",
                      "border-b last:border-b-0"
                    )}
                    style={{
                      width: "100%",
                      paddingTop: "16px",
                      paddingRight: "24px",
                      paddingBottom: "16px",
                      paddingLeft: "24px",
                      gap: "8px",
                      fontFamily: "Pretendard, sans-serif",
                      fontWeight: isActive ? 700 : 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: isLightMode
                        ? "#0F0F0F"
                        : isActive
                          ? "#FFFFFF"
                          : "#E0E1E5",
                      backgroundColor: isLightMode
                        ? isActive
                          ? "rgba(237, 238, 240, 1)"
                          : "rgba(255, 255, 255, 0.8)"
                        : isActive
                          ? "rgba(0, 40, 52, 1)"
                          : "rgba(7, 20, 25, 0.8)",
                      borderBottomWidth: "1px",
                      borderBottomColor: isLightMode
                        ? "rgba(237, 238, 240, 1)"
                        : "rgba(0, 40, 52, 1)",
                      borderBottomStyle: "solid",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {nav.label}
                  </LinkComponent>
                </li>
              );
            })}

            {/* 모바일용 도구들 - SNS 아이콘 */}
            <li>
              <div
                className={"flex items-center"}
                style={{
                  width: "100%",
                  paddingTop: "16px",
                  paddingRight: "24px",
                  paddingBottom: "16px",
                  paddingLeft: "24px",
                  gap: "16px",
                  fontFamily: "Pretendard, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: isLightMode ? "#0F0F0F" : "#E0E1E5",
                  backgroundColor: isLightMode
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(7, 20, 25, 0.8)",
                  borderBottomWidth: "1px",
                  borderBottomColor: isLightMode
                    ? "rgba(237, 238, 240, 1)"
                    : "rgba(0, 40, 52, 1)",
                  borderBottomStyle: "solid",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <a
                  className={
                    "cursor-pointer w-6 h-6 relative flex items-center justify-center"
                  }
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  href={"https://x.com/gotcar_official"}
                  aria-label={"Follow GOTCAR on X (Twitter)"}
                >
                  <Image
                    src={
                      isLightMode
                        ? "/images/x-icon-black.png"
                        : "/images/x-icon.png"
                    }
                    width={24}
                    height={24}
                    alt={"Follow GOTCAR on X (Twitter)"}
                    title={"GOTCAR Official X (Twitter) Account"}
                    loading={"lazy"}
                  />
                </a>
                <a
                  className={
                    "cursor-pointer w-6 h-6 relative flex items-center justify-center"
                  }
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  href={"https://t.me/Gotcar_Official"}
                  aria-label={"Join GOTCAR Telegram Community"}
                >
                  <Image
                    src={
                      isLightMode
                        ? "/images/telegram-icon-black.png"
                        : "/images/telegram-icon.png"
                    }
                    width={24}
                    height={24}
                    alt={"Join GOTCAR Telegram Community"}
                    title={"GOTCAR Official Telegram Channel"}
                    loading={"lazy"}
                  />
                </a>
              </div>
            </li>

            {/* 모바일용 도구들 - Docs & Wallet */}
            <li>
              <div
                className={"flex items-center"}
                style={{
                  width: "100%",
                  paddingTop: "16px",
                  paddingRight: "16px",
                  paddingBottom: "16px",
                  paddingLeft: "16px",
                  gap: "8px",
                  backgroundColor: isLightMode
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(7, 20, 25, 0.8)",
                  borderBottomWidth: "1px",
                  borderBottomColor: isLightMode
                    ? "rgba(237, 238, 240, 1)"
                    : "rgba(0, 40, 52, 1)",
                  borderBottomStyle: "solid",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <NextLink
                  href={"/whitepaper.pdf"}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  className={"flex-1"}
                >
                  <button
                    className={clsx(
                      "flex items-center justify-center gap-2 w-full",
                      "bg-[#2F2F31] rounded-xl",
                      "text-[#FFFFFF] font-bold text-sm leading-[22px] text-center align-middle",
                      "h-[42px]"
                    )}
                    style={{
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    <span>{t("home.docs1")}</span>
                    <Image
                      src={"/images/docs-arrow.png"}
                      width={8}
                      height={8}
                      alt={"Open GOTCAR documentation"}
                      title={"GOTCAR Documentation - Whitepaper"}
                      className={"object-contain"}
                      loading={"lazy"}
                    />
                  </button>
                </NextLink>
                <button
                  onClick={handleBuyGocarClick}
                  className={clsx(
                    "flex items-center justify-center gap-2 flex-1",
                    "bg-primary rounded-xl",
                    "text-[#0F0F0F] font-bold text-sm leading-[22px] text-center align-middle",
                    "h-[42px]"
                  )}
                  style={{
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  {wallet.address
                    ? shortenAddress(wallet.address)
                    : t("home.presaleJoin2")}
                </button>
              </div>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
};

const A = () => {
  useLockBodyScroll();
  return null;
};
