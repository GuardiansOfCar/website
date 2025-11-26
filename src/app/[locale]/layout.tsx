import type { Metadata, ResolvingMetadata } from "next";
import "../globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { PropsWithChildren } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import LocaleProvider from "@/app/[locale]/provider";
import { readFileSync } from "fs";
 import { GoogleAnalytics } from '@next/third-parties/google'
 import Script from "next/script";

const GTM_ID = "GTM-W57C5XSF";

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
        readFileSync(`./messages/en.json`, "utf-8"),
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
    metadataBase: new URL("https://guardiansofthecar.com"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout(props: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      <div className={"relative z-[10]"}>
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider>
            <header className={"fixed top-0 left-0 right-0 z-[100] w-full flex justify-center pt-4"}>
              <Nav />
            </header>
            <div className={"pt-[94px]"}>{props.children}</div>
            <footer className={"z-[3] relative w-full"} style={{ backgroundColor: "rgba(249, 251, 251, 1)", marginTop: 0 }}>
              <Footer />
            </footer>
          </LocaleProvider>
        </NextIntlClientProvider>
      </div>
      <GoogleAnalytics gaId="G-J4MM2WMN55" />
    </>
  );
}
