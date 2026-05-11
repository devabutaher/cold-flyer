export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/_next/", "/auth/"],
      },
      {
        userAgent: "googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/_next/", "/auth/"],
      },
    ],
    sitemap: "https://coldflyer.com/sitemap.xml",
    host: "https://coldflyer.com",
  };
}
