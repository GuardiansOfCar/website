import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { PropsWithChildren } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Banner } from "@/components/banner";
import LocaleProvider from "@/app/[locale]/provider";

const grandstander = localFont({
  src: "../../../public/fonts/Grandstander.ttf",
});

export const metadata: Metadata = {
  title: "GUARDIANS OF THE CAR",
};

export default async function LocaleLayout(props: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${grandstander.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider>
            <header className={"min-w-[var(--max-width)]"}>
              <Nav />
              <Banner />
            </header>
            <div className={"min-w-[var(--max-width)]"}>{props.children}</div>
            <footer className={"min-w-[var(--max-width)]"}>
              <Footer />
            </footer>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
