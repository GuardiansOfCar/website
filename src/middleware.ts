import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";

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
  }

  if (RegExp(/^\/(en|ko|tr|ar)(\/.*)?$|^\/$/).test(path)) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
