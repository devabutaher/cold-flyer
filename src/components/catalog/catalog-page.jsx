"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CatalogFilters } from "./catalog-filters";
import { CatalogGrid } from "./catalog-grid";
import { useTranslations } from "next-intl";

export function CatalogPage({
  type = "product",
  queryKey = [],
  fetchFn,
  fetchAllFn,
  extractArray,
  buildFilterOptions,
  sortOptions,
  defaultSort,
  itemLabel,
  searchComponent,
}) {
  const searchParams = useSearchParams();

  const params = useMemo(
    () => ({
      q: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      brand: searchParams.get("brand") || undefined,
      productType: searchParams.get("producttype") || undefined,
      serviceType: searchParams.get("servicetype") || undefined,
      sort: searchParams.get("sort") || undefined,
    }),
    [searchParams],
  );

  const { data: allItems = [] } = useQuery({
    queryKey: [...queryKey, "all"],
    queryFn: async () => {
      const res = await fetchAllFn();
      return extractArray(res);
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      const res = await fetchFn({ ...params, limit: "50" });
      return extractArray(res);
    },
    staleTime: 2 * 60 * 1000,
  });

  const filterOptions = useMemo(() => {
    if (!buildFilterOptions) return [];
    return buildFilterOptions(Array.isArray(allItems) ? allItems : []);
  }, [allItems, buildFilterOptions]);

  const t = useTranslations("common");
  const q = searchParams.get("q");
  const filtersType = type === "product" ? "items" : "services";

  return (
    <>
      <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
        <CatalogFilters
          type={filtersType}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          defaultSort={defaultSort}
          searchComponent={searchComponent}
        />
      </Suspense>
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">{t("resultsFor", { query: q })}</h1>
        </div>
      )}
      <CatalogGrid items={items} isLoading={isLoading} error={error} type={type} itemLabel={itemLabel} />
    </>
  );
}

export default CatalogPage;
