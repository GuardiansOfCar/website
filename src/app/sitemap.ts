import { MetadataRoute } from "next";

const baseRoutes = [
  "",
  "/referral",
  "/staking",
];

const supportedLocales = ["en", "zh-CN", "ja"];
const domain = "https://guardiansofthecar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = baseRoutes.flatMap((route) => {
    return supportedLocales.map((locale) => {
      const langPath = locale === "en" ? route : `/${locale}${route}`;
      return {
        url: `${domain}${langPath}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: supportedLocales.reduce((acc, lang) => {
            const altLangPath = lang === "en" ? route : `/${lang}${route}`;
            return {
              ...acc,
              [lang]: `${domain}${altLangPath}`,
            };
          }, {} as Record<string, string>),
        },
      };
    });
  });

  return sitemapEntries;
}
