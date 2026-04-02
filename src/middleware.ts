import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

const locales = routing.locales;
const defaultLocale = routing.defaultLocale;
const CANONICAL_HOST = "guardiansofthecar.com";

// 더 이상 지원하지 않는 옛 locale 목록 (과거 사이트에서 사용됨)
const legacyLocales = ["ko", "fr", "de", "nl", "ru", "es", "th", "zh-TW"];

// 더 이상 존재하지 않는 옛 경로 목록
const legacyPaths = ["/chapters", "/howtobuy", "/roadmap", "/g2e"];

function detectLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const host = req.headers.get("host") || "";

  // ====================================================
  // 1. www → non-www 강제 301 리다이렉트 (SEO canonical 통일)
  // ====================================================
  if (host.startsWith("www.")) {
    const canonicalUrl = new URL(req.url);
    canonicalUrl.host = CANONICAL_HOST;
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // ====================================================
  // 2. 옛 locale/경로 → 301 리다이렉트 (과거 크롤링된 URL 정리)
  // ====================================================
  const pathSegments = path.split("/").filter(Boolean);
  const firstSegment = pathSegments[0] || "";

  // 옛 locale → /en으로 301 리다이렉트
  if (legacyLocales.includes(firstSegment)) {
    const restPath = pathSegments.slice(1).join("/");
    const redirectUrl = new URL(
      `/en${restPath ? `/${restPath}` : ""}`,
      req.url,
    );
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 옛 경로 (현재 locale 하위의 /chapters, /howtobuy 등) → 해당 locale 홈으로 301
  const locale = locales.includes(firstSegment as any) ? firstSegment : null;
  if (locale) {
    const subPath = `/${pathSegments.slice(1).join("/")}`;
    if (legacyPaths.some((lp) => subPath.startsWith(lp))) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url), 301);
    }
  }

  // ====================================================
  // 3. Geo IP 차단 (US, CN)
  // ====================================================
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0];

  if (ip && !path.includes("/denied")) {
    // 외부 Geo IP API 호출 (예: ipapi.co, ipinfo.io 등)
    const geoRes = await fetch(`https://ipinfo.io/${ip}/json/`);
    const geoData = await geoRes.json();
    const countryCode = geoData.country;

    if (["US", "CN"].includes(countryCode)) {
      const deniedUrl = req.nextUrl.clone();
      deniedUrl.pathname = "/en/denied";
      return NextResponse.rewrite(deniedUrl);
    }
  }

  if (path.startsWith("/admin")) {
    if (path !== "/admin/login") {
      if (path === "/admin") {
        return NextResponse.redirect(new URL("/admin/staking", req.nextUrl));
      }
      const cookie = (await cookies()).get("session")?.value;
      const session = await decrypt(cookie);
      if (!session?.sub) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
      }
    }
    return NextResponse.next();
  }

  // ====================================================
  // 5. locale 라우팅
  // ====================================================
  const hasLocale = locales.includes(firstSegment as any);

  if (!hasLocale) {
    const detectedLocale = "en"; // detectLocale(req);
    const newUrl = new URL(`/${detectedLocale}${path}`, req.url);
    newUrl.search = req.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|videos|naver1f4a5aea87268b7abedb774b77810c7a.html|robots.txt|sitemap.xml|fonts|whitepaper.pdf|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
