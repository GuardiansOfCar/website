import type { Metadata } from "next";
import { HomeContainer } from "@/app/[locale]/(home)/components/home-container";
import Script from "next/script";
import { readFileSync } from "fs";

type Props = {
  params: Promise<{ locale: string }>;
};

// ISR: 1시간마다 재생성
export const revalidate = 3600;

// 정적 경로 생성: 빌드 시 각 언어별로 페이지 생성
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh-CN" }, { locale: "ja" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://guardiansofthecar.com";

  // 기본값 (영어)
  let metadata = {
    title:
      "GOTCAR - Guardians Of The Car | AI-Powered Mobility Ecosystem | Zero Accidents",
    description:
      "GOTCAR transforms real-time driving data into secure, private, and valuable digital assets. Powered by AI Mobility Agent, building a safer, smarter, and decentralized mobility ecosystem. Join the Guardians and earn rewards through G2E (Guardians-to-Earn).",
    keywords:
      "GOTCAR, Guardians Of The Car, AI mobility, autonomous driving, blockchain mobility, drive to earn, G2E, Guardians-to-Earn, cryptocurrency, meme coin, AI agent, AI Mobility Agent, vehicle positioning, precision positioning, traffic safety, smart mobility, Web3 mobility, decentralized mobility, car token, mobility ecosystem, road safety, AI navigation, mobility data, blockchain technology, Mobility Data Blockchain, Precision Positioning AI Engine, crypto staking, referral program, token presale, zero accidents, real-time driving data, digital assets, mobility analytics, smart payment, AI risk alert, precision parking, indoor parking, B2B data, OEM partnerships",
    ogLocale: "en_US",
  };

  try {
    const messages = JSON.parse(
      readFileSync(`./messages/${locale}.json`, "utf-8")
    );
    if (messages.metadata?.home) {
      const ogLocaleMap: Record<string, string> = {
        "zh-CN": "zh_CN",
        "zh-TW": "zh_TW",
        ja: "ja_JP",
      };
      metadata = {
        title: messages.metadata.home.title,
        description: messages.metadata.home.description,
        keywords: messages.metadata.home.keywords,
        ogLocale: ogLocaleMap[locale] || "en_US",
      };
    }
  } catch (e) {
    console.error("Error reading metadata for locale:", locale);
  }

  const localeMap: Record<string, string> = {
    en: "en_US",
    "zh-CN": "zh_CN",
    "zh-TW": "zh_TW",
    ja: "ja_JP",
  };

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.split(", "),
    authors: [{ name: "GOTCAR Team" }],
    creator: "GOTCAR",
    publisher: "GOTCAR",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
      siteName: "GOTCAR",
      images: [
        {
          url: `${baseUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
      locale: metadata.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [`${baseUrl}/images/og-image.png`],
      creator: "@gotcar_official",
    },
    alternates: {
      canonical: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}`,
        "zh-CN": `${baseUrl}/zh-CN`,
        ja: `${baseUrl}/ja`,
      },
    },
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
    verification: {
      google: "G-J4MM2WMN55",
    },
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GOTCAR - Guardians Of The Car",
  url: "https://guardiansofthecar.com",
  logo: "https://guardiansofthecar.com/images/gocar.png",
  description:
    "GOTCAR transforms real-time driving data into secure, private, and valuable digital assets. Powered by AI Mobility Agent, building a safer, smarter, and decentralized mobility ecosystem.",
  foundingDate: "2024",
  sameAs: ["https://x.com/gotcar_official", "https://t.me/GOTCAR_Official"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "admin@guardiansofthecar.com",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Artificial Intelligence",
    "Blockchain Technology",
    "Autonomous Driving",
    "Mobility Services",
    "Cryptocurrency",
    "Smart Mobility",
    "Vehicle Positioning",
    "Traffic Safety",
  ],
};

const productStructuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "GOTCAR Token",
  description:
    "The utility token of Guardians of the Car, the first-ever car meme project with a mission to revolutionize the global mobility ecosystem. Used for mobility-related payments, G2E rewards, staking, and community incentives.",
  brand: {
    "@type": "Brand",
    name: "GOTCAR",
  },
  category: "Cryptocurrency",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "USD",
  },
};

const softwareApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GOTCAR Guardian App",
  applicationCategory: "MobileApplication",
  operatingSystem: "iOS, Android",
  description:
    "AI-powered mobility app that transforms driving data into valuable digital assets. Features include precision positioning, AI risk alerts, smart payments, and Guardians-to-Earn rewards.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Precision Positioning AI Engine",
    "Mobility Data Blockchain",
    "AI Mobility Agent",
    "G2E (Guardians-To-Earn)",
    "Smart Payment",
    "AI Risk Alert",
    "Precision Parking",
    "Mobility Analytics",
  ],
};

export default async function Page({ params }: Props) {
  return (
    <>
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="structured-data-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <Script
        id="structured-data-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationStructuredData),
        }}
      />
      <HomeContainer />
    </>
  );
}
