"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListFilter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavSearch } from "../layout/navbar/nav-search";

const snakeCase = (str) =>
  str
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");

const defaultSortOptions = ["All Products", "Price: Low to High", "Price: High to Low", "Best Rated", "Most Popular", "Newest"];

export function CatalogFilters({
  type = "items",
  searchComponent: SearchComponent,
  searchFallback = null,
  sortOptions = defaultSortOptions,
  defaultSort = "",
  filterOptions = [],
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

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
    if (key === "Category") defaultValue = t("allCategories");
    if (key === "Brand") defaultValue = t("allBrands");
    if (key === "ServiceType") defaultValue = t("allTypes");
    if (key === "Sort") defaultValue = defaultSort || sortOptions[0] || "";

    const filter = filterOptions.find((f) => f.key === key);
    let paramValue = value;

    if (filter?.key === "ServiceType") {
      paramValue = snakeCase(value);
    }

    if (
      value === defaultValue ||
      value === t("all") ||
      value === t("allProducts") ||
      value === t("allCategories") ||
      value === t("allBrands") ||
      value === t("allTypes")
    ) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, paramValue);
    }

    params.set("page", "1");

    const route = type === "services" ? "/services" : "/items";

    router.push(`${route}?${params.toString()}`);
  };

  const handleClearAll = () => {
    const route = type === "services" ? "/services" : "/items";
    router.push(route);
    setOpen(false);
  };

  const activeFilterCount = filterOptions.filter((filter) => {
    const paramKey = filter.key.toLowerCase();
    const urlValue = searchParams.get(paramKey);
    return urlValue && urlValue !== snakeCase(filter.defaultValue || "");
  }).length + (searchParams.get("sort") ? 1 : 0);

  return (
    <div className="py-3">
      {/* Mobile: compact bar with search + filters button */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex-1">
          <Suspense fallback={searchFallback || <div className="w-full h-9 bg-muted animate-pulse rounded-lg" />}>
            {SearchComponent ? <SearchComponent /> : <NavSearch />}
          </Suspense>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="shrink-0 relative">
          <ListFilter size={14} className="mr-1.5" />
          {t("filters")}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop: full filter bar */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ListFilter size={15} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t("filters")}</span>
        </div>
        <div className="flex items-center gap-2">
          {filterOptions.map((filter) => (
            <FilterDropdown
              key={filter.key}
              value={getCurrentValue(filter) || filter.defaultValue || `${t("all")} ${filter.key}s`}
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
        <div className="ml-auto w-64">
          <Suspense fallback={searchFallback || <div className="w-full h-8 bg-muted animate-pulse rounded" />}>
            {SearchComponent ? <SearchComponent /> : <NavSearch />}
          </Suspense>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto pb-8">
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <SheetTitle className="text-lg">{t("filters")}</SheetTitle>
            <SheetDescription className="sr-only">{t("filters")}</SheetDescription>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs text-muted-foreground">
                  <X size={14} className="mr-1" />
                  {t("clearAll") || "Clear all"}
                </Button>
              )}
            </div>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {filterOptions.map((filter) => (
              <div key={filter.key}>
                <label className="text-sm font-medium mb-1.5 block">{filter.key}</label>
                <FilterDropdown
                  value={getCurrentValue(filter) || filter.defaultValue || `${t("all")} ${filter.key}s`}
                  options={filter.options}
                  onChange={(val) => {
                    handleFilterChange(filter.key, val);
                  }}
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("sortBy") || "Sort by"}</label>
              <FilterDropdown
                value={getSortValue()}
                options={sortOptions}
                onChange={(val) => {
                  handleFilterChange("Sort", val);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CatalogFilters;
