export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com";

async function getAllProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?limit=1000`, {
      credentials: "include",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const products = data?.data?.products || data?.products || [];
    return products;
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

async function getAllServices() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services?limit=1000`, {
      credentials: "include",
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const services = data?.data?.services || data?.services || [];
    return services;
  } catch (error) {
    console.error("Error fetching services for sitemap:", error);
    return [];
  }
}

export default async function GET() {
  let products = [];
  let services = [];

  try {
    products = await getAllProducts();
  } catch (e) {
    console.warn("Could not fetch products for sitemap");
  }

  try {
    services = await getAllServices();
  } catch (e) {
    console.warn("Could not fetch services for sitemap");
  }

  const staticPages = ["", "/items", "/services", "/about", "/contact", "/faq", "/terms", "/shipping", "/cart"];

  const productPages = products.map((product) => ({
    url: `${siteUrl}/items/${product.slug || product._id}`,
    lastModified: product.updatedAt || product.createdAt || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const servicePages = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug || service._id}`,
    lastModified: service.updatedAt || service.createdAt || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const allPages = [
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: path === "" ? 1.0 : 0.9,
    })),
    ...productPages,
    ...servicePages,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export async function generateMetadata() {
  return {
    robots: "noindex, nofollow",
  };
}
