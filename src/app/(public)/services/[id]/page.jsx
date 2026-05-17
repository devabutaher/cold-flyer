import { notFound } from "next/navigation";
import { getServiceSchema, getBreadcrumbSchema } from "@/lib/seo";
import { sanitizeForRSC } from "@/lib/utils";
import { StructuredData } from "@/components/structured-data";
import ServiceDetailClient from "@/components/detail/service-detail";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.com";

async function fetchService(slug) {
  try {
    const res = await fetch(`${API_URL}/api/services/slug/${slug}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.service || data?.service || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  if (!slug) return {};

  const service = await fetchService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const imageUrl = service.images?.[0]?.url || service.images?.[0] || "/placeholder-service.jpg";
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`;
  const description =
    service.description?.slice(0, 160) ||
    `Professional ${service.name} by Cold Flyer. ${service.category || ""} services in Bangladesh. Expert technicians, best service.`.slice(
      0,
      160,
    );

  return {
    title: `${service.name} | Cold Flyer AC Services`,
    description,
    openGraph: {
      title: `${service.name} | Cold Flyer AC Services`,
      description,
      url: `${SITE_URL}/services/${service.slug || slug}`,
      siteName: "Cold Flyer",
      images: [{ url: fullImageUrl, width: 1200, height: 630, alt: service.name }],
      locale: "en_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | Cold Flyer AC Services`,
      description,
      images: [fullImageUrl],
    },
    alternates: { canonical: `${SITE_URL}/services/${service.slug || slug}` },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function ServicePage({ params }) {
  const { id: slug } = await params;
  if (!slug) notFound();

  const service = sanitizeForRSC(await fetchService(slug));
  if (!service) notFound();

  const serviceSchema = getServiceSchema(service);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    {
      name: service.category || "Services",
      url: `${SITE_URL}/services?category=${encodeURIComponent(service.category || "")}`,
    },
    { name: service.name, url: `${SITE_URL}/services/${slug}` },
  ]);

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <StructuredData schema={breadcrumbSchema} />
      <ServiceDetailClient service={service} />
    </>
  );
}
