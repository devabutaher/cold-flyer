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

function ACPartsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const rawSort = searchParams.get("sort");
  const params = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      brand: brand || undefined,
      productType: "part",
      sort: rawSort ? (SORT_MAP[rawSort] || "newest") : undefined,
    }),
    [q, category, brand, rawSort],
  );

  const { data: allProducts, isLoading: allLoading } = useProductsQuery({ productType: "part", limit: 200 });
  const { data: products, isLoading, error } = useProductsQuery({ ...params, limit: 50 });

  return (
    <CatalogPage
      type="product"
      data={products}
      allData={allProducts}
      isLoading={isLoading || allLoading}
      error={error}
      buildFilterOptions={(products) => [
        {
          key: "Category",
          defaultValue: "All Categories",
          options: ["All Categories", ...uniqueSorted(products.map((p) => p.category))],
        },
        {
          key: "Brand",
          defaultValue: "All Brands",
          options: ["All Brands", ...uniqueSorted(products.map((p) => p.brand))],
        },
      ]}
      sortOptions={SORT_OPTIONS}
      defaultSort="Newest"
      itemLabel="product"
    />
  );
}

export default function ACPartsPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
      <ACPartsContent />
    </Suspense>
  );
}
