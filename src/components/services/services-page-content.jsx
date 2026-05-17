"use client";

import { useTranslations } from "next-intl";
import { useServicesQuery } from "@/hooks/queries/services";
import { PackageSearch } from "lucide-react";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { Skeleton } from "@/components/ui/skeleton";

function ServiceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-48 w-full" />
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function ServicesPageContent() {
  const t = useTranslations("common");
  const { data: services = [], isLoading, error } = useServicesQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg">{t("noServicesFound")}</h3>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {t("serviceCount", { count: services.length })}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <CatalogCard key={service._id || service.id} item={service} type="service" />
        ))}
      </div>
    </div>
  );
}
