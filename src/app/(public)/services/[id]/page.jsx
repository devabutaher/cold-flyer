import ServiceDetailClient from "@/components/detail/service-detail";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/seo";
import { sanitizeForRSC } from "@/lib/utils";
import { getServiceBySlugServer } from "@/lib/actions/services";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.vercel.app";

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  if (!slug) return {};

  const service = await getServiceBySlugServer(slug);

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
    `Professional ${service.name} by Cold Flyer. ${service.category || ""} services in Bangladesh. Expert workers, best service.`.slice(
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

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export default async function ServicePage({ params }) {
  const { id: slug } = await params;
  if (!slug) notFound();

  const service = sanitizeForRSC(await getServiceBySlugServer(slug));
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
      {serviceSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
      <ServiceDetailClient service={service} />
    </>
  );
}
