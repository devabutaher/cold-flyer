"use client";

export function JsonLd({ data }) {
  if (!data) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cold Flyer",
    url: "https://coldflyer.com",
    logo: "https://coldflyer.com/logo.png",
    description: "Leading AC supplier and service provider in Bangladesh",
    sameAs: [
      "https://facebook.com/coldflyer",
      "https://instagram.com/coldflyer",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+8801XXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Bengali"],
    },
  };

  return <JsonLd data={schema} />;
}

export function WebsiteSchema() {
  const schema = {
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

  return <JsonLd data={schema} />;
}