import { notFound } from "next/navigation";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/seo";
import { sanitizeForRSC } from "@/lib/utils";
import { ProductDetailClient } from "@/components/detail/product-detail.client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com";

async function fetchProduct(slug) {
  try {
    const res = await fetch(`${API_URL}/api/products/slug/${slug}`, { next: { tags: ["products", "product-detail"] } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.product || data?.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  if (!slug) return {};

  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const imageUrl = product.images?.[0]?.url || product.images?.[0] || "/placeholder-product.jpg";
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`;
  const description =
    product.description?.slice(0, 160) ||
    `Buy ${product.name} at Cold Flyer. Best price in Bangladesh. ${product.category || ""} ${product.brand || ""}`.slice(0, 160);

  return {
    title: `${product.name} | Cold Flyer AC Shop`,
    description,
    openGraph: {
      title: `${product.name} | Cold Flyer AC Shop`,
      description,
      url: `${SITE_URL}/items/${product.slug || slug}`,
      siteName: "Cold Flyer",
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: product.name }],
      locale: "en_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Cold Flyer AC Shop`,
      description,
      images: [fullImageUrl],
    },
    alternates: { canonical: `${SITE_URL}/items/${product.slug || slug}` },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({ params }) {
  const { id: slug } = await params;
  if (!slug) notFound();

  const product = sanitizeForRSC(await fetchProduct(slug));
  if (!product) notFound();

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Products", url: `${SITE_URL}/items` },
    {
      name: product.category || "Products",
      url: `${SITE_URL}/items?category=${encodeURIComponent(product.category || "")}`,
    },
    { name: product.name, url: `${SITE_URL}/items/${slug}` },
  ]);

  return (
    <>
      {productSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
      <ProductDetailClient product={product} />
    </>
  );
}
