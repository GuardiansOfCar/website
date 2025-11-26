import type { Metadata } from "next";
import Script from "next/script";
import { FaqPageClient } from "./faq-client";
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
    title: "GOTCAR FAQ | Frequently Asked Questions | Crypto Presale Guide",
    description:
      "Find answers to frequently asked questions about GOTCAR, the first car meme coin with AI-powered mobility. Learn about $GOTCAR token, presale, staking, and the Guardians ecosystem.",
    keywords:
      "GOTCAR FAQ, crypto FAQ, presale FAQ, token FAQ, GOTCAR questions, car meme coin FAQ, AI mobility FAQ, blockchain FAQ, staking questions, G2E FAQ, Guardians FAQ, cryptocurrency guide",
    ogLocale: "en_US",
  };

  try {
    const messages = JSON.parse(
      readFileSync(`./messages/${locale}.json`, "utf-8")
    );
    if (messages.metadata?.faq) {
      metadata = {
        title: messages.metadata.faq.title || metadata.title,
        description: messages.metadata.faq.description || metadata.description,
        keywords: messages.metadata.faq.keywords || metadata.keywords,
        ogLocale:
          locale === "zh-CN" ? "zh_CN" : locale === "ja" ? "ja_JP" : "en_US",
      };
    }
  } catch (e) {
    console.error("Error reading metadata for locale:", locale);
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords ? metadata.keywords.split(", ") : [],
    authors: [{ name: "GOTCAR Team" }],
    creator: "GOTCAR",
    publisher: "GOTCAR",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: locale === "en" ? `${baseUrl}/faq` : `${baseUrl}/${locale}/faq`,
      siteName: "GOTCAR",
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/og-image.png`,
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
      images: [`${baseUrl}/images/og-image.png`],
    },
    alternates: {
      canonical:
        locale === "en" ? `${baseUrl}/faq` : `${baseUrl}/${locale}/faq`,
      languages: {
        en: `${baseUrl}/faq`,
        "zh-CN": `${baseUrl}/zh-CN/faq`,
        ja: `${baseUrl}/ja/faq`,
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

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is $GOTCAR Token?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The $GOTCAR Token is the utility token of Guardians of the Car, the first-ever car meme project with a mission to revolutionize the global mobility ecosystem. Powered by Web3.0-based AI Agent services, GOTCAR aims to create a world where humans no longer experience traffic accidents.",
      },
    },
    {
      "@type": "Question",
      name: "Why Should You Join the GOTCAR Guardians Now?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GOTCAR is the first car meme project designed to deliver real-world utility. Join early and become part of a groundbreaking project with the potential to succeed like Tesla, BNB, and SHIB!",
      },
    },
    {
      "@type": "Question",
      name: "What makes Guardians of the Car so unique?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GOTCAR is more than just a meme project—it is pioneering innovative utility services. We are introducing groundbreaking solutions never seen before, all while striving for zero traffic accidents.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI technology work in Guardians of the Car?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GOTCAR's AI Agent utilizes the Guardians' data to provide forward collision alerts, notifications for signal violations and wrong-way vehicles, and road hazard analysis based on weather conditions, ensuring the safety of both drivers and pedestrians.",
      },
    },
    {
      "@type": "Question",
      name: "When will Guardians of the Car launch its main features?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Guardians of the Car services will be launched in phases. Starting in 2025, the project will roll out staking, node services, and G2E as the initial features. Following this, more advanced AI-based safety and convenience services will be introduced.",
      },
    },
    {
      "@type": "Question",
      name: "When do I get my tokens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Once the presale ends and the token launches, you can instantly claim your $GOTCAR tokens. Simply connect your wallet and click 'Claim'— it's that easy!",
      },
    },
  ],
};

export default async function FaqPage({ params }: Props) {
  return (
    <>
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <FaqPageClient />
    </>
  );
}
