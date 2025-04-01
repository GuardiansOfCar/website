import { MetadataRoute } from "next";
import { readdirSync } from "fs";

const baseRoutes = [
  "",
  "/chapters/1",
  "/chapters/2",
  "/chapters/3",
  "/chapters/4",
  "/faq",
  "/g2e",
  "/howtobuy",
  "/referral",
  "/roadmap",
  "/staking",
];
const messagesDir = "./messages";
const domain = "https://guardiansofthecar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const languageFiles = readdirSync(messagesDir);
  const languages = languageFiles
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));

  const sitemapEntries: MetadataRoute.Sitemap = baseRoutes.flatMap((route) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${domain}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: languages.reduce((acc, lang) => {
          // 기본 언어(예: en)는 루트 경로 사용, 다른 언어는 /lang/ 접두사 추가
          const langPath = lang === "en" ? route : `/${lang}${route}`;
          return {
            ...acc,
            [lang]: `${domain}${langPath}`,
          };
        }, {}),
      },
    };

    return entry;
  });

  return sitemapEntries;
}
