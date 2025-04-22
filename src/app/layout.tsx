import { PropsWithChildren } from "react";
import Head from "next/head";
import Script from "next/script";



export default function RootLayout(props: PropsWithChildren) {
  return (
    <>
      <Head>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GOTCAR",
              url: "https://guardiansofthecar.com",
              logo: "https://guardiansofthecar.com/images/gocar.png",
            }),
          }}
        />
      </Head>
      {props.children}
    </>
  );
}
