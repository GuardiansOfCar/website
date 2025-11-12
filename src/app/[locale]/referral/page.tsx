import type { Metadata } from "next";
import Script from "next/script";
import { ReferralPageClient } from "./referral-client";
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
    title: "GOTCAR Referral Program | My Referral Status | Earn 5% Rewards",
    description: "Invite friends and earn 5% rewards with GOTCAR referral program. Generate your referral code, track your referral status, and earn rewards when your referrals participate in the GOTCAR ecosystem.",
    keywords: "GOTCAR referral, referral program, crypto referral, referral rewards, invite friends, earn rewards, referral code, GOTCAR referral program, cryptocurrency referral, blockchain referral, token referral, referral bonus, affiliate program, referral tracking, referral status, 5% referral reward, referral commission, referral link, referral system, referral earnings, referral history",
    ogLocale: "en_US",
  };

  try {
    const messages = JSON.parse(readFileSync(`./messages/${locale}.json`, "utf-8"));
    if (messages.metadata?.referral) {
      metadata = {
        title: messages.metadata.referral.title,
        description: messages.metadata.referral.description,
        keywords: messages.metadata.referral.keywords,
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
      url: locale === "en" ? `${baseUrl}/referral` : `${baseUrl}/${locale}/referral`,
      siteName: "GOTCAR",
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/gocar.png`,
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
      images: [`${baseUrl}/images/gocar.png`],
    },
    alternates: {
      canonical: locale === "en" ? `${baseUrl}/referral` : `${baseUrl}/${locale}/referral`,
      languages: {
        en: `${baseUrl}/referral`,
        "zh-CN": `${baseUrl}/zh-CN/referral`,
        ja: `${baseUrl}/ja/referral`,
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

const referralStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProgramMembership",
  name: "GOTCAR Referral Program",
  description: "Invite friends and earn 5% rewards with GOTCAR referral program. Generate referral codes, track referral status, and earn rewards when your referrals participate.",
  programName: "GOTCAR Referral",
  provider: {
    "@type": "Organization",
    name: "GOTCAR",
    url: "https://guardiansofthecar.com",
  },
  membershipPointsEarned: "5%",
  benefits: "Earn 5% rewards when your referrals participate in the GOTCAR ecosystem",
};

export default async function ReferralPage({ params }: Props) {
  return (
    <>
      <Script
        id="structured-data-referral"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(referralStructuredData) }}
      />
      <ReferralPageClient />
    </>
  );
}
