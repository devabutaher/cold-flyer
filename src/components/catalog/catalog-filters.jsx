"use client";

import { Suspense } from "react";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { sortOptions as defaultSortOptions } from "@/data/filtering-options";
import { ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavSearch } from "../layout/navbar/nav-search";

const snakeCase = (str) =>
  str
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");

export function CatalogFilters({
  type = "items",
  searchComponent: SearchComponent,
  searchFallback = null,
  sortOptions = defaultSortOptions,
  defaultSort = "",
  filterOptions = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getCurrentValue = (filter) => {
    const paramKey = filter.key.toLowerCase();
    const urlValue = searchParams.get(paramKey);

    if (!urlValue) return filter.defaultValue || "";

    const match = filter.options?.find((opt) => {
      const optStr = typeof opt === "string" ? opt : opt.label || opt.value;
      if (filter.key === "ServiceType") {
        return snakeCase(optStr) === urlValue;
      }
      return optStr.toLowerCase() === urlValue.toLowerCase();
    });

    if (match) return match;

    if (filter.key === "ServiceType") {
      return urlValue.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return urlValue.charAt(0).toUpperCase() + urlValue.slice(1);
  };

  const normalize = (str) => str.toLowerCase().replace(/[:#]/g, "").trim();

  const getSortValue = () => {
    const urlValue = searchParams.get("sort");
    if (!urlValue) return defaultSort || sortOptions[0] || "";
    const normalizedUrl = normalize(urlValue);
    const match = sortOptions.find((opt) => normalize(opt) === normalizedUrl);
    return match || defaultSort || sortOptions[0] || "";
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const paramKey = key.toLowerCase();

    let defaultValue = defaultSort;
    if (key === "Category") defaultValue = "All Categories";
    if (key === "Brand") defaultValue = "All Brands";
    if (key === "ServiceType") defaultValue = "All Types";
    if (key === "Sort") defaultValue = defaultSort || sortOptions[0] || "";

    const filter = filterOptions.find((f) => f.key === key);
    let paramValue = value;

    if (filter?.key === "ServiceType") {
      paramValue = snakeCase(value);
    }

    if (
      value === defaultValue ||
      value === "All" ||
      value === "All Products" ||
      value === "All Categories" ||
      value === "All Brands" ||
      value === "All Types"
    ) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, paramValue);
    }

    params.set("page", "1");

    const route = type === "services" ? "/services" : "/items";

    router.push(`${route}?${params.toString()}`);
  };

  return (
    <div className="py-3 flex flex-col lg:flex-row items-start lg:items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ListFilter size={15} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase tracking-widest">Filters:</span>
      </div>

      <div className="w-full lg:w-max lg:order-2 lg:ml-auto shrink-0">
        <Suspense fallback={searchFallback || <div className="w-full h-8 bg-muted animate-pulse rounded" />}>
          {SearchComponent ? <SearchComponent /> : <NavSearch />}
        </Suspense>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full lg:order-1">
        {filterOptions.map((filter) => (
          <FilterDropdown
            key={filter.key}
            value={getCurrentValue(filter) || filter.defaultValue || `All ${filter.key}s`}
            options={filter.options}
            onChange={(val) => handleFilterChange(filter.key, val)}
          />
        ))}
        <FilterDropdown
          value={getSortValue()}
          options={sortOptions}
          onChange={(val) => handleFilterChange("Sort", val)}
        />
      </div>
    </div>
  );
}

export default CatalogFilters;
