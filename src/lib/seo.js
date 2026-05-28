/**
 * SEO Utilities - Helper functions for metadata and structured data
 */

export function getProductSchema(product) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.vercel.app";
  const imageUrl = product.images?.[0]?.url || product.images?.[0] || "/placeholder-product.jpg";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Buy ${product.name} at Cold Flyer - Best price in Bangladesh`,
    image: imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`,
    sku: product.sku || product._id,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/items/${product.slug || product._id}`,
      priceCurrency: "BDT",
      price: product.price || product.basePrice,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Cold Flyer",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        }
      : undefined,
  };
}

export function getServiceSchema(service) {
  if (!service) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://coldflyer.vercel.app";
  const imageUrl = service.images?.[0]?.url || service.images?.[0] || "/placeholder-service.jpg";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: service.name,
    description: service.description || `Professional ${service.name} service by Cold Flyer`,
    image: imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl}`,
    url: `${baseUrl}/services/${service.slug || service._id}`,
    priceRange: "$$$",
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    provider: {
      "@type": "Organization",
      name: "Cold Flyer",
      telephone: "+8801XXXXXXXXX",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
        addressLocality: "Dhaka",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} Packages`,
      itemListElement: [
        {
          "@type": "Offer",
          name: `${service.name} - Standard`,
          price: service.basePrice,
          priceCurrency: "BDT",
        },
      ],
    },
    aggregateRating: service.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: service.rating,
          reviewCount: service.reviewCount || 0,
        }
      : undefined,
  };
}

export function getBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cold Flyer",
    url: "https://coldflyer.com",
    logo: "https://coldflyer.com/logo.png",
    description: "Leading AC supplier and service provider in Bangladesh",
    sameAs: ["https://facebook.com/coldflyer", "https://instagram.com/coldflyer", "https://twitter.com/coldflyer"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801XXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dhaka, Bangladesh",
      addressCountry: "BD",
      addressLocality: "Dhaka",
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cold Flyer",
    url: "https://coldflyer.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://coldflyer.com/items?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
