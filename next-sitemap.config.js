/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://guardiansofthecar.com",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/denied", "/*/denied"],
  alternateRefs: [
    { href: "https://guardiansofthecar.com/en", hreflang: "en" },
    { href: "https://guardiansofthecar.com/zh-CN", hreflang: "zh-CN" },
    { href: "https://guardiansofthecar.com/ja", hreflang: "ja" },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/denied", "/*/denied"],
      },
    ],
    additionalSitemaps: [],
  },
};
