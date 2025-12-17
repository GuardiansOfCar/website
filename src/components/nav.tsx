"use client";

import { useTranslations } from "next-intl";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname, Link as IntlLink } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
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

  const params = useParams();
  const selected = params.locale as string;

  // Staking이나 Referral 페이지인지 확인 (pathname 사용)
  const isLightMode =
    pathname.includes("/staking") || pathname.includes("/referral");

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
      // mousedown 대신 click 사용 - 링크 클릭이 먼저 처리되도록
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [langOpened]);

  const handleBuyGocarClick = () => {
    if (wallet.address) {
      wallet.disconnect();
    } else {
      walletConnectorStore.setConnect(true);
    }
  };

  const listNav = (
    <ul
      className={"flex items-center max-laptop:gap-[32px]"}
      style={{ gap: "48px" }}
    >
      {[
        {
          label: t("home.nav1"),
          href: `/${selected}` as `/${string}`,
          isHome: true,
        },
        {
          label: t("home.nav6"),
          href: `/${selected}/staking` as `/${string}/staking`,
        },
        {
          label: t("home.nav7"),
          href: `/${selected}/referral` as `/${string}/referral`,
        },
      ].map((nav, index) => {
        // 현재 경로와 비교 (pathname 직접 사용으로 SSR/CSR 일치)
        const isActive = nav.isHome
          ? pathname === "/"
          : pathname.startsWith(nav.href.replace(`/${selected}`, ""));
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
                "max-laptop:px-5 max-laptop:py-5 max-laptop:justify-between",
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
              "max-laptop:px-5 max-laptop:py-5 max-laptop:justify-between max-laptop:w-full",
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
            alt={t("common.languageSettings")}
            title={t("common.changeLanguage")}
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
            alt={
              langOpened
                ? t("common.closeLanguageMenu")
                : t("common.openLanguageMenu")
            }
            title={
              langOpened
                ? t("common.closeLanguageMenu")
                : t("common.openLanguageMenu")
            }
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
                // 현재 URL 경로와 파라미터를 유지하면서 언어만 변경
                const currentSearch = searchParams.toString();
                // pathname이 "/" 또는 빈 문자열일 경우 "/" 사용
                const basePath = pathname || "/";
                // 직접 locale prefix를 붙인 절대 경로 생성
                const newHref = `/${chapter.key}${basePath}${currentSearch ? `?${currentSearch}` : ""}`;

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
                      selected === chapter.key && "!text-primary",
                      "px-4 max-laptop:px-8 max-laptop:py-4 max-laptop:w-full"
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
          "flex items-center max-laptop:grid max-laptop:grid-cols-2 max-laptop:space-x-0 max-laptop:gap-3 max-laptop:px-5 max-laptop:py-4 border-b-primary  max-laptop:border-b-[4px]"
        }
      >
        <a
          className={
            "cursor-pointer w-6 h-6 relative flex items-center justify-center"
          }
          target={"_blank"}
          rel={"noopener noreferrer"}
          href={"https://x.com/gotcar_official"}
          aria-label={t("common.followX")}
        >
          <Image
            src={
              isLightMode ? "/images/x-icon-black.png" : "/images/x-icon.png"
            }
            width={24}
            height={24}
            alt={t("common.followX")}
            title={t("common.xAccount")}
            loading={"lazy"}
          />
        </a>

        <a
          className={
            "cursor-pointer w-6 h-6 relative flex items-center justify-center max-laptop:ml-0"
          }
          style={{ marginLeft: "16px" }}
          target={"_blank"}
          rel={"noopener noreferrer"}
          href={"https://t.me/Gotcar_Official"}
          aria-label={t("common.joinTelegram")}
        >
          <Image
            src={
              isLightMode
                ? "/images/telegram-icon-black.png"
                : "/images/telegram-icon.png"
            }
            width={24}
            height={24}
            alt={t("common.joinTelegram")}
            title={t("common.telegramChannel")}
            loading={"lazy"}
          />
        </a>

        <div className={"max-laptop:hidden"} style={{ marginLeft: "16px" }}>
          {renderLanguage()}
        </div>

        {/* docs 임시 주석 처리 */}
        {/* <NextLink
          href={"/whitepaper.pdf"}
          target={"_blank"}
          rel={"noopener noreferrer"}
          className={"max-laptop:ml-0"}
          style={{ marginLeft: "16px" }}
        >
          <button
            className={clsx(
              "flex items-center justify-center gap-2",
              "bg-[#2F2F31] rounded-xl",
              "text-[#FFFFFF] font-bold text-sm leading-[22px] text-center align-middle",
              "w-[80px] h-[42px]",
              "max-laptop:w-full"
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
              alt={t("common.openDocs")}
              title={t("common.docsTitle")}
              className={"object-contain"}
              loading={"lazy"}
            />
          </button>
        </NextLink> */}

        <button
          onClick={handleBuyGocarClick}
          className={clsx(
            "max-laptop:col-span-2 max-laptop:ml-0",
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
        "max-laptop:max-w-[calc(100%-32px)] max-laptop:w-[calc(100%-32px)] max-laptop:mx-4 max-laptop:rounded-2xl max-laptop:border-b-0 max-laptop:bg-black max-laptop:backdrop-blur-none max-laptop:justify-between max-laptop:pt-4 max-laptop:px-4 max-laptop:pb-[19px]"
      )}
      style={{
        backgroundColor: isLightMode ? "white" : "rgba(7,20,25,0.8)",
      }}
    >
      <NextLink
        href={`/${selected}`}
        className={"flex items-center flex-shrink-0 gap-2 max-laptop:gap-[6px]"}
      >
        <Image
          src={
            isLightMode ? "/images/logo-black.png" : "/images/gotcar-logo.png"
          }
          alt={t("common.logoAlt")}
          title={t("common.logoTitle")}
          width={24}
          height={24}
          className={"object-contain max-laptop:w-[18px] max-laptop:h-[18px]"}
          loading={"eager"}
          fetchPriority={"high"}
        />
        <Image
          src={
            isLightMode
              ? "/images/gotcar-text-black.png"
              : "/images/gotcar-text.png"
          }
          alt={t("common.textLogoAlt")}
          title={t("common.textLogoTitle")}
          width={117}
          height={20}
          className={"object-contain max-laptop:w-[88px] max-laptop:h-[15px]"}
          loading={"eager"}
          fetchPriority={"high"}
        />
      </NextLink>
      <div
        className={"max-laptop:hidden flex-1"}
        style={{ marginLeft: "40px" }}
      >
        {listNav}
      </div>

      <div
        className={"max-laptop:hidden flex-shrink-0"}
        style={{ marginLeft: "20px" }}
      >
        {listTools}
      </div>

      {/* 모바일: 언어 선택기 + 햄버거 메뉴 */}
      <div
        className={"hidden max-laptop:flex items-center gap-4 flex-shrink-0"}
      >
        <div className={"relative"}>{renderLanguage(true)}</div>
        <button
          onClick={handleMenuClick}
          aria-label={menuOpen ? t("common.closeMenu") : t("common.openMenu")}
        >
          <Image
            src={menuOpen ? "/images/menu-close.png" : "/images/menu.png"}
            alt={menuOpen ? t("common.closeMenu") : t("common.openMenu")}
            title={
              menuOpen ? t("common.closeMenuTitle") : t("common.openMenuTitle")
            }
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
            className={"fixed inset-0 z-[40] max-laptop:block hidden"}
            style={{
              backgroundColor: "transparent",
            }}
            onClick={() => setMenuOpen(false)}
          />
          {/* 모바일용 네비게이션 목록 */}
          <ul
            className={clsx(
              "fixed z-[50] hidden max-laptop:block",
              "top-[94px] flex flex-col"
            )}
            style={{
              // height: "376px",
              width: "calc(100vw - 32px)",
              maxWidth: "calc(100vw - 32px)",
              left: "16px",
              right: "16px",
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
                href: `/${selected}` as `/${string}`,
                isHome: true,
              },
              {
                label: t("home.nav6"),
                href: `/${selected}/staking` as `/${string}/staking`,
              },
              {
                label: t("home.nav7"),
                href: `/${selected}/referral` as `/${string}/referral`,
              },
            ].map((nav, index) => {
              // 현재 경로와 비교 (pathname 직접 사용으로 SSR/CSR 일치)
              const isActive = nav.isHome
                ? pathname === "/"
                : pathname.startsWith(nav.href.replace(`/${selected}`, ""));
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
                  aria-label={t("common.followX")}
                >
                  <Image
                    src={
                      isLightMode
                        ? "/images/x-icon-black.png"
                        : "/images/x-icon.png"
                    }
                    width={24}
                    height={24}
                    alt={t("common.followX")}
                    title={t("common.xAccount")}
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
                  aria-label={t("common.joinTelegram")}
                >
                  <Image
                    src={
                      isLightMode
                        ? "/images/telegram-icon-black.png"
                        : "/images/telegram-icon.png"
                    }
                    width={24}
                    height={24}
                    alt={t("common.joinTelegram")}
                    title={t("common.telegramChannel")}
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
                {/* docs 임시 주석 처리 */}
                {/* <NextLink
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
                      alt={t("common.openDocs")}
                      title={t("common.docsTitle")}
                      className={"object-contain"}
                      loading={"lazy"}
                    />
                  </button>
                </NextLink> */}
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
