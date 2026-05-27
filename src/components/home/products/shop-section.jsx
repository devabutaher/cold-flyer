"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedProductsQuery } from "@/hooks/queries/products";
import { useFeaturedServicesQuery } from "@/hooks/queries/services";
import { CheckCircle, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import DataCarousel from "./data-carousel";

function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden h-full flex flex-col">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 flex flex-col grow space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-auto" />
      </div>
    </div>
  );
}

function ServiceFeatures({ features }) {
  return (
    <>
      {features?.slice(0, 3).map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <CheckCircle size={18} className="shrink-0 text-primary" strokeWidth={2.5} />
          <span className="text-sm font-medium text-foreground">{feature}</span>
        </div>
      ))}
    </>
  );
}

function ServiceCard({ service }) {
  const tc = useTranslations("common");
  const src = service.image || service.images?.[0]?.url;

  return (
    <div className="group relative rounded-2xl bg-card transition-shadow duration-300 hover:shadow-lg border border-border/50 h-full flex flex-col">
      <div className="mb-6 overflow-hidden rounded-t-2xl bg-muted h-48 relative">
        <Link href={`/services/${service.slug}`} className="relative block h-full">
          {src ? (
            <Image
              src={src}
              alt={service.name}
              fill
              quality={85}
              loading="lazy"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <Wrench className="h-12 w-12 text-primary/40" />
            </div>
          )}
        </Link>
      </div>

      <div className="p-4 flex flex-col grow">
        <Link href={`/services/${service.slug}`}>
          <h3 className="mb-3 text-xl font-bold text-foreground md:text-2xl hover:text-primary transition-colors">
            {service.name}
          </h3>
        </Link>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base grow">
          {service.shortDescription || service.description}
        </p>
        <div className="mb-6 space-y-3">
          <ServiceFeatures features={service.includes} />
        </div>
        <Button className="w-full" asChild>
          <Link href={`/book/${service._id}`}>{tc("bookNow")}</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ShopSection() {
  const t = useTranslations("home");

  const { data: featuredServices = [], isLoading: loadingServices } = useFeaturedServicesQuery();
  const { data: acUnits = [], isLoading: loadingUnits } = useFeaturedProductsQuery({ productType: "unit", limit: 10 });
  const { data: parts = [], isLoading: loadingParts } = useFeaturedProductsQuery({ productType: "part", limit: 10 });

  return (
    <div>
      <DataCarousel
        items={featuredServices}
        loading={loadingServices}
        title={t("ourBestServices")}
        tag={t("professionalSolutions")}
        catalogLabel={t("viewAllServices")}
        catalogLink="/services"
        renderCard={(service) => <ServiceCard service={service} />}
        renderSkeleton={() => <ServiceCardSkeleton />}
      />

      <DataCarousel
        items={acUnits}
        loading={loadingUnits}
        title={t("premiumAcUnits")}
        tag={t("ourStore")}
        catalogLabel={t("viewFullCatalog")}
        catalogLink="/items?productType=unit"
      />

      <DataCarousel
        items={parts}
        loading={loadingParts}
        title={t("precisionAcParts")}
        tag={t("replacements")}
        catalogLabel={t("exploreParts")}
        catalogLink="/items?productType=part"
      />
    </div>
  );
}
