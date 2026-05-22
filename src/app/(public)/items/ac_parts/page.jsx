"use client";

import { Suspense } from "react";
import { getClient, extractList } from "@/lib/http-client";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { uniqueSorted } from "@/lib/utils";

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Best Rated", "Most Popular"];

const SORT_MAP = {
  "Newest": "newest",
  "Price: Low to High": "price_asc",
  "Price: High to Low": "price_desc",
  "Best Rated": "rating",
  "Most Popular": "popular",
};

function ACPartsContent() {
  const buildQuery = (params = {}) => {
    const query = new URLSearchParams();
    if (params?.q) query.set("search", params.q);
    if (params?.category && params.category !== "All Categories") query.set("category", params.category);
    if (params?.brand && params.brand !== "All Brands") query.set("brand", params.brand);
    if (params?.sort) query.set("sortBy", SORT_MAP[params.sort] || "newest");
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    query.set("productType", "part");
    return query;
  };

  return (
    <CatalogPage
      type="product"
      queryKey={["products", "parts"]}
      fetchFn={(params) => {
        const qs = buildQuery(params).toString();
        return getClient().get(`/products?${qs}`).then((r) => r.data);
      }}
      fetchAllFn={() => {
        const qs = buildQuery({ limit: 200 }).toString();
        return getClient().get(`/products?${qs}`).then((r) => r.data);
      }}
      extractArray={(res) => extractList(res, "products")}
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
