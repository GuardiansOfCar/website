import type { Metadata } from "next";
import Script from "next/script";
import { StakingPageClient } from "./staking-client";
import { readFileSync } from "fs";

type Props = {
  params: Promise<{ locale: string }>;
};

// ISR: 1시간마다 재생성
export const revalidate = 3600;

// 정적 경로 생성: 빌드 시 각 언어별로 페이지 생성
export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "zh-CN" },
    { locale: "ja" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://guardiansofthecar.com";
  
  // 기본값 (영어)
  let metadata = {
    title: "GOTCAR Token Staking | My TOKEN STAKING Status | Earn Rewards",
    description: "Stake your GOTCAR tokens and earn rewards. View your staking status, staked balance, available balance, and estimated rewards. GOTCAR staking rewards are distributed over three years with dynamic reward rates.",
    keywords: "GOTCAR staking, token staking, crypto staking, GOTCAR rewards, staking rewards, blockchain staking, DeFi staking, cryptocurrency staking, token rewards, staking platform, GOTCAR token, earn crypto, staking balance, unstaking, claim rewards, staking status, staked balance, available balance, annual reward rate, pool rate, total staked, reward distribution, three year staking, dynamic rewards",
    ogLocale: "en_US",
  };

  try {
    const messages = JSON.parse(readFileSync(`./messages/${locale}.json`, "utf-8"));
    if (messages.metadata?.staking) {
      metadata = {
        title: messages.metadata.staking.title,
        description: messages.metadata.staking.description,
        keywords: messages.metadata.staking.keywords,
        ogLocale: locale === "zh-CN" ? "zh_CN" : locale === "ja" ? "ja_JP" : "en_US",
      };
    }
  } catch (e) {
    console.error("Error reading metadata for locale:", locale);
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.split(", "),
    authors: [{ name: "GOTCAR Team" }],
    creator: "GOTCAR",
    publisher: "GOTCAR",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: locale === "en" ? `${baseUrl}/staking` : `${baseUrl}/${locale}/staking`,
      siteName: "GOTCAR",
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/staking.png`,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
      locale: metadata.ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [`${baseUrl}/images/staking.png`],
    },
    alternates: {
      canonical: locale === "en" ? `${baseUrl}/staking` : `${baseUrl}/${locale}/staking`,
      languages: {
        en: `${baseUrl}/staking`,
        "zh-CN": `${baseUrl}/zh-CN/staking`,
        ja: `${baseUrl}/ja/staking`,
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
  };
}

const stakingStructuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "GOTCAR Token Staking",
  description: "Stake GOTCAR tokens and earn rewards over three years with dynamic reward rates. View staking status, manage staked balance, and claim rewards.",
  provider: {
    "@type": "Organization",
    name: "GOTCAR",
    url: "https://guardiansofthecar.com",
  },
  category: "Cryptocurrency Staking",
  termsOfService: "https://guardiansofthecar.com",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: "100",
  },
};

export default async function StakingPage({ params }: Props) {
  return (
    <>
      <Script
        id="structured-data-staking"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stakingStructuredData) }}
      />
      <StakingPageClient />
    </>
  );
}
