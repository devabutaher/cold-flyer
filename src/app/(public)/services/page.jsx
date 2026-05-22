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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleCase(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ServicesContent() {
  return (
    <CatalogPage
      type="service"
      queryKey={["services"]}
      fetchFn={(params) => {
        const query = new URLSearchParams();
        if (params?.q) query.set("search", params.q);
        if (params?.category) query.set("category", params.category);
        if (params?.serviceType) query.set("serviceType", params.serviceType);
        if (params?.sort) query.set("sortBy", SORT_MAP[params.sort] || "newest");
        if (params?.limit) query.set("limit", String(params.limit));
        const qs = query.toString();
        return getClient().get(`/services${qs ? `?${qs}` : ""}`).then((r) => r.data);
      }}
      fetchAllFn={() => getClient().get("/services?limit=200").then((r) => r.data)}
      extractArray={(res) => extractList(res, "services")}
      buildFilterOptions={(services) => [
        {
          key: "Category",
          defaultValue: "All Categories",
          options: ["All Categories", ...uniqueSorted(services.map((s) => s.category)).map(capitalize)],
        },
        {
          key: "ServiceType",
          defaultValue: "All Types",
          options: ["All Types", ...uniqueSorted(services.map((s) => s.serviceType)).map(titleCase)],
        },
      ]}
      sortOptions={SORT_OPTIONS}
      defaultSort="Newest"
      itemLabel="service"
    />
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
      <ServicesContent />
    </Suspense>
  );
}
