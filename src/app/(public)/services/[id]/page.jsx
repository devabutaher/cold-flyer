import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchAPI, getServiceSchema, getBreadcrumbSchema } from "@/lib/seo";
import ServiceDetailClient from "@/components/detail/service-detail";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getService(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/services/slug/${slug}`, {
      credentials: "include",
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.service || data?.service || null;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  if (!slug) return {};
  
  const service = await getService(slug);
  
  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com";
  const imageUrl = service.images?.[0]?.url || service.images?.[0] || "/placeholder-service.jpg";
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`;
  
  return {
    title: `${service.name} | Cold Flyer AC Services`,
    description: service.description?.slice(0, 160) || `Professional ${service.name} by Cold Flyer. ${service.category || ''} services in Bangladesh. Expert technicians, best service.`.slice(0, 160),
    openGraph: {
      title: `${service.name} | Cold Flyer AC Services`,
      description: service.description?.slice(0, 160) || `Professional ${service.name} by Cold Flyer. Expert technicians in Bangladesh.`,
      url: `${siteUrl}/services/${service.slug || slug}`,
      siteName: "Cold Flyer",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
      locale: "en_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | Cold Flyer AC Services`,
      description: service.description?.slice(0, 160) || `Professional ${service.name} by Cold Flyer.`,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: `${siteUrl}/services/${service.slug || slug}`,
    },
  };
}

export async function generateStaticParams() {
  return [];
}

function sanitizeService(service) {
  if (!service) return null;
  return JSON.parse(JSON.stringify(service));
}

export default async function ServicePage({ params }) {
  const { id: slug } = await params;
  if (!slug) notFound();
  
  const rawService = await getService(slug);
  
  if (!rawService) {
    notFound();
  }
  
  const service = sanitizeService(rawService);
  
  const serviceSchema = getServiceSchema(service);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://coldflyer.com" },
    { name: "Services", url: "https://coldflyer.com/services" },
    { name: service.category || "Services", url: `https://coldflyer.com/services?category=${encodeURIComponent(service.category || '')}` },
    { name: service.name, url: `https://coldflyer.com/services/${slug}` },
  ]);
  
  return (
    <>
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ServiceDetailClient service={service} />
    </>
  );
}