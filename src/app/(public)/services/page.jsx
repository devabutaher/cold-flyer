"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api-client";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";

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

const serviceSortOptions = ["Popular", "Price: Low to High", "Price: High to Low", "Best Rated"];

function ServicesGrid({ services }) {
  const results = Array.isArray(services) ? services : [];

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg">No services found</h3>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {results.length} service{results.length !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((service) => (
          <CatalogCard key={service._id || service.id} item={service} type="service" />
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
    const fetchFilters = async () => {
      try {
        const res = await apiGet("/services?limit=200");
        let services = [];
        if (Array.isArray(res)) services = res;
        else if (Array.isArray(res?.data)) services = res.data;
        else if (Array.isArray(res?.data?.services)) services = res.data.services;
        else if (Array.isArray(res?.services)) services = res.services;

        const cats = [...new Set(services.map((s) => s.category).filter(Boolean))].sort();
        const types = [...new Set(services.map((s) => s.serviceType).filter(Boolean))].sort();
        setCategories(cats);
        setServiceTypes(types);
      } catch (err) {
        console.error("Error fetching filters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  if (loading) {
    return (
      <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="ml-auto w-48 h-8 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <CatalogFilters
      type="services"
      filterOptions={[
        {
          key: "Category",
          defaultValue: "All Categories",
          options: ["All Categories", ...categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1))],
        },
        {
          key: "ServiceType",
          defaultValue: "All Types",
          options: [
            "All Types",
            ...serviceTypes.map((t) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
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
  const category = searchParams.get("category") || "";
  const serviceType = searchParams.get("servicetype") || "";
  const sort = searchParams.get("sort") || "Popular";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (serviceType) params.set("serviceType", serviceType);
        params.set("limit", "50");

        const endpoint = params.toString() ? `/services?${params}` : "/services";
        const res = await apiGet(endpoint);

        let data = [];
        if (Array.isArray(res)) data = res;
        else if (Array.isArray(res?.data)) data = res.data;
        else if (Array.isArray(res?.data?.services)) data = res.data.services;
        else if (Array.isArray(res?.services)) data = res.services;

        setServices(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category, serviceType]);

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

  return (
    <>
      <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
        <ServicesFilters />
      </Suspense>
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">
            Results for <span className="text-primary">&quot;{q}&quot;</span>
          </h1>
        </div>
      )}
      <ServicesGrid services={services} />
    </>
  );
}
