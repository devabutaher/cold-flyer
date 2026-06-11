"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { useServicesQuery } from "@/hooks/queries/services";
import { uniqueSorted } from "@/lib/utils";

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Best Rated", "Most Popular"];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleCase(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ServicesContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const serviceType = searchParams.get("servicetype");
  const sort = searchParams.get("sort");
  const params = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      serviceType: serviceType || undefined,
      sort: sort || undefined,
    }),
    [q, category, serviceType, sort],
  );

  const { data: allServices, isLoading, error } = useServicesQuery({ ...params, limit: 200 });

  return (
    <CatalogPage
      type="service"
      data={allServices}
      allData={allServices}
      isLoading={isLoading}
      error={error}
      buildFilterOptions={(services) => [
        {
          key: "Category",
          defaultValue: "All Categories",
          options: ["All Categories", ...uniqueSorted(services.map((s) => s.category)).map(capitalize)],
        },
        {
          key: "ServiceType",
          defaultValue: "All Types",
          options: ["All Types", ...uniqueSorted(services.map((s) => s.serviceType)).map(titleCase)],
        },
      ]}
      sortOptions={SORT_OPTIONS}
      defaultSort="Newest"
      itemLabel="service"
    />
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
      <ServicesContent />
    </Suspense>
  );
}
