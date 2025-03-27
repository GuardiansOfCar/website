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
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|videos|fonts|whitepaper.pdf|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
