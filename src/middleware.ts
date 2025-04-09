import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

const locales = routing.locales;
const defaultLocale = routing.defaultLocale;

function detectLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}


const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

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


  // 2. locale prefix가 없는 경우 리디렉션
  const pathnameParts = path.split("/");
  const firstSegment = pathnameParts[1];
  const hasLocale = locales.includes(firstSegment as any);

  if (!hasLocale) {
    const detectedLocale = detectLocale(req);
    const newUrl = new URL(`/${detectedLocale}${path}`, req.url);
    return NextResponse.redirect(newUrl);
  }


  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|videos|naver1f4a5aea87268b7abedb774b77810c7a.html|robots.txt|sitemap.xml|fonts|whitepaper.pdf|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
