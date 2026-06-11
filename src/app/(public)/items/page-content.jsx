"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { useProductsQuery } from "@/hooks/queries/products";
import { uniqueSorted } from "@/lib/utils";

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Best Rated", "Most Popular"];

const SORT_MAP = {
  Newest: "newest",
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Best Rated": "rating",
  "Most Popular": "popular",
};

function ItemsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const productType = searchParams.get("producttype");
  const rawSort = searchParams.get("sort");
  const params = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      brand: brand || undefined,
      productType: productType || undefined,
      sort: rawSort ? (SORT_MAP[rawSort] || "newest") : undefined,
    }),
    [q, category, brand, productType, rawSort],
  );

  const { data: allProducts, isLoading, error } = useProductsQuery({ ...params, limit: 200 });

  return (
    <CatalogPage
      type="product"
      data={allProducts}
      allData={allProducts}
      isLoading={isLoading}
      error={error}
      buildFilterOptions={(items) => [
        {
          key: "Category",
          defaultValue: "All Categories",
          options: ["All Categories", ...uniqueSorted(items.map((p) => p.category))],
        },
        {
          key: "Brand",
          defaultValue: "All Brands",
          options: ["All Brands", ...uniqueSorted(items.map((p) => p.brand))],
        },
      ]}
      sortOptions={SORT_OPTIONS}
      defaultSort="Newest"
      itemLabel="product"
    />
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
      <ItemsContent />
    </Suspense>
  );
}
