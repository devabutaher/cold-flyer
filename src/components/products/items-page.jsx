"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useProductsQuery } from "@/hooks/queries";
import { apiGet } from "@/lib/api-client";
import { PackageSearch } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CatalogCard } from "../catalog/catalog-card";
import { CatalogFilters } from "../catalog/catalog-filters";
import { Skeleton } from "../ui/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-52 w-full" />
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function ProductsGrid() {
  const t = useTranslations("common");
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";

  const {
    products: data,
    loading,
    error,
  } = useProductSearch({
    q,
    category,
    brand,
    sort,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-destructive mb-4" />
        <h3 className="font-sans font-bold text-lg text-destructive mb-1">{t("failedToLoadProducts")}</h3>
        <p className="text-muted-foreground text-sm">{t("pleaseTryAgain")}</p>
      </div>
    );
  }

  const results = Array.isArray(data) ? data : [];

  const categories = [...new Set(results.map((p) => p.category).filter(Boolean))].sort();
  const brands = [...new Set(results.map((p) => p.brand).filter(Boolean))].sort();

  return (
    <CatalogFilters
      type="items"
      filterOptions={[
        { key: "Category", defaultValue: t("allCategories"), options: [t("allCategories"), ...categories] },
        { key: "Brand", defaultValue: t("allBrands"), options: [t("allBrands"), ...brands] },
      ]}
    />
  );
}
