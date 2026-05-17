"use client";

import { Suspense } from "react";
import { getClient, extractList } from "@/lib/http-client";
import { CatalogPage } from "@/components/catalog/catalog-page";
import { uniqueSorted } from "@/lib/utils";

const SORT_OPTIONS = ["All Products", "Price: Low to High", "Price: High to Low", "Best Rated", "Most Popular", "Newest"];

function ItemsContent() {
  return (
    <CatalogPage
      type="product"
      queryKey={["products"]}
      fetchFn={(params) => {
        const query = new URLSearchParams();
        if (params?.q) query.set("search", params.q);
        if (params?.category && params.category !== "All Categories") query.set("category", params.category);
        if (params?.brand && params.brand !== "All Brands") query.set("brand", params.brand);
        if (params?.sort) query.set("sortBy", params.sort);
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        const qs = query.toString();
        return getClient().get(`/products${qs ? `?${qs}` : ""}`).then((r) => r.data);
      }}
      fetchAllFn={() => getClient().get("/products?limit=200").then((r) => r.data)}
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
