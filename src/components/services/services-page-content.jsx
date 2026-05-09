"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CatalogCard } from "../catalog/catalog-card";
import { CatalogFilters } from "../catalog/catalog-filters";
import { Skeleton } from "../ui/skeleton";
import servicesApi from "@/lib/api/services";
import ServiceSearch from "./service-search";

function ServiceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-48 w-full" />
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

const serviceSortOptions = ["Popular", "Price: Low to High", "Price: High to Low", "Best Rated"];

function ServicesGrid() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const serviceType = searchParams.get("servicetype") || "";
  const sort = searchParams.get("sort") || "Popular";

  const {
    data: results,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["services", { q, category, serviceType, sort }],
    queryFn: async () => {
      try {
        const res = await servicesApi.getServices({
          category: category || undefined,
          serviceType: serviceType || undefined,
          limit: 100,
        });
        let data = res.data?.services || res.services || [];

        if (q) {
          const search = q.toLowerCase();
          data = data.filter(
            (s) =>
              s.name?.toLowerCase().includes(search) ||
              s.description?.toLowerCase().includes(search) ||
              s.category?.toLowerCase().includes(search)
          );
        }

        if (sort === "Price: Low to High") {
          data = [...data].sort((a, b) => a.basePrice - b.basePrice);
        } else if (sort === "Price: High to Low") {
          data = [...data].sort((a, b) => b.basePrice - a.basePrice);
        } else if (sort === "Best Rated") {
          data = [...data].sort((a, b) => b.rating - a.rating);
        }

        return data;
      } catch (err) {
        console.error("Services API error:", err);
        throw err;
      }
    },
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-destructive">Failed to load services</p>
      </div>
    );
  }

  const services = results || [];

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground">No services found</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {services.length} service{services.length !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <CatalogCard key={service._id ?? service.id} item={service} type="service" />
        ))}
      </div>
    </div>
  );
}

function ServicesFilters() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await servicesApi.getServices({ limit: 100 });
        const data = res.data?.services ?? res.services ?? [];
        setCategories([...new Set(data.map((s) => s.category).filter(Boolean))].sort());
        setServiceTypes([...new Set(data.map((s) => s.serviceType).filter(Boolean))].sort());
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <CatalogFilters
      type="services"
      searchComponent={ServiceSearch}
      filterOptions={[
        {
          key: "Category",
          defaultValue: "All Categories",
          options: [
            "All Categories",
            ...categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
          ],
        },
        {
          key: "ServiceType",
          defaultValue: "All Types",
          options: [
            "All Types",
            ...serviceTypes.map((t) =>
              t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            ),
          ],
        },
      ]}
      sortOptions={serviceSortOptions}
      defaultSort="Popular"
    />
  );
}

export default function ServicesPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <>
      <Suspense
        fallback={
          <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
            <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Filters:
              </span>
            </div>
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="ml-auto w-48 h-8 bg-muted animate-pulse rounded" />
          </div>
        }
      >
        <ServicesFilters />
      </Suspense>
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">
            Results for <span className="text-primary">&quot;{q}&quot;</span>
          </h1>
        </div>
      )}
      <ServicesGrid />
    </>
  );
}