"use client";

import { useEffect, useState } from "react";

import servicesApi from "@/lib/api/services";
import { sortOptions } from "@/data/filtering-options";
import { ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterDropdown from "@/components/ui/filter-dropdown";
import ServiceFiltersSkeleton from "./service-filters-skeleton";

export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const serviceTypeParam = searchParams.get("serviceType") || "";
  const sortParam = searchParams.get("sort") || "Popular";

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await servicesApi.getServices({ limit: 100 });
        const data = res.data?.services ?? res.services ?? [];
        setServices(data);
        setCategories([...new Set(data.map((s) => s.category).filter(Boolean))].sort());
        setServiceTypes([...new Set(data.map((s) => s.serviceType).filter(Boolean))].sort());
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === `All ${key}s` || value === "All" || value === "Popular") {
      params.delete(key.toLowerCase());
    } else {
      params.set(key.toLowerCase(), value);
    }

    params.set("page", "1");
    router.push(`/services?${params.toString()}`);
  };

  if (loading) {
    return <ServiceFiltersSkeleton />;
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="py-3 flex flex-col lg:flex-row items-start lg:items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ListFilter size={15} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Filters:
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full lg:order-1">
        <FilterDropdown
          value={categoryParam || "All Categories"}
          options={["All Categories", ...categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1))]}
          onChange={(val) => handleFilterChange("Category", val)}
        />
        <FilterDropdown
          value={serviceTypeParam || "All Types"}
          options={["All Types", ...serviceTypes.map((t) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))]}
          onChange={(val) => handleFilterChange("ServiceType", val)}
        />
        <FilterDropdown
          value={sortParam}
          options={sortOptions}
          onChange={(val) => handleFilterChange("Sort", val)}
        />
      </div>
    </div>
  );
}