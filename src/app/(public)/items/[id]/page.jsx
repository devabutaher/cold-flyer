import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchAPI, getProductSchema, getBreadcrumbSchema } from "@/lib/seo";
import { ProductDetailClient } from "@/components/detail/product-detail.client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getProduct(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/slug/${slug}`, {
      credentials: "include",
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.product || data?.product || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  if (!slug) return {};

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com";
  const imageUrl = product.images?.[0]?.url || product.images?.[0] || "/placeholder-product.jpg";
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`;

  return {
    title: `${product.name} | Cold Flyer AC Shop`,
    description:
      product.description?.slice(0, 160) ||
      `Buy ${product.name} at Cold Flyer. Best price in Bangladesh. ${product.category || ""} ${product.brand || ""}`.slice(
        0,
        160,
      ),
    openGraph: {
      title: `${product.name} | Cold Flyer AC Shop`,
      description: product.description?.slice(0, 160) || `Buy ${product.name} at Cold Flyer. Best price in Bangladesh.`,
      url: `${siteUrl}/items/${product.slug || slug}`,
      siteName: "Cold Flyer",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Cold Flyer AC Shop`,
      description: product.description?.slice(0, 160) || `Buy ${product.name} at Cold Flyer. Best price in Bangladesh.`,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/items/${product.slug || slug}`,
    },
  };
}

export async function generateStaticParams() {
  return [];
}

function sanitizeProduct(product) {
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

export default async function ProductPage({ params }) {
  const { id: slug } = await params;
  if (!slug) notFound();

  const rawProduct = await getProduct(slug);

  if (!rawProduct) {
    notFound();
  }

  const product = sanitizeProduct(rawProduct);

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://coldflyer.com" },
    { name: "Products", url: "https://coldflyer.com/items" },
    {
      name: product.category || "Products",
      url: `https://coldflyer.com/items?category=${encodeURIComponent(product.category || "")}`,
    },
    { name: product.name, url: `https://coldflyer.com/items/${slug}` },
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
