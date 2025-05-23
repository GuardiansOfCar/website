import type { Metadata, ResolvingMetadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { PropsWithChildren } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Banner } from "@/components/banner";
import LocaleProvider from "@/app/[locale]/provider";
import { readFileSync } from "fs";
 import { GoogleAnalytics } from '@next/third-parties/google'

const grandstander = localFont({
  src: "../../../public/fonts/Grandstander.ttf",
});

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;

  let metadata = {
    title: "Guardians Of The Car | GOTCAR",
    openGraphTitle: "GOTCAR Official Site",
    openGraphDescription:
      "Guardians Of The Car. First AI Base Drive to Earn Project",
  };

  try {
    metadata = JSON.parse(
      readFileSync(`./messages/${locale}.json`, "utf-8"),
    ).metadata;
    if (!metadata?.title) {
      metadata = JSON.parse(
        readFileSync(`./messages/ko.json`, "utf-8"),
      ).metadata;
    }
  } catch (e: unknown) {
    console.error("Error to read messages json");
  }

  return {
    title: metadata.title,
    openGraph: {
      title: metadata.openGraphTitle,
      description: metadata.openGraphDescription,
    },
  };
}

export default async function LocaleLayout(props: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${grandstander.className} antialiased`}>
        <div className={"relative z-[10]"}>
          <NextIntlClientProvider messages={messages}>
            <LocaleProvider>
              <header className={" z-[4] relative"}>
                <Nav />
                <Banner />
              </header>
              <div className={""}>{props.children}</div>
              <footer className={"z-[3] relative"}>
                <Footer />
              </footer>
            </LocaleProvider>
          </NextIntlClientProvider>
        </div>
      </body>
     <GoogleAnalytics gaId="G-J4MM2WMN55" />
    </html>
  );
}
