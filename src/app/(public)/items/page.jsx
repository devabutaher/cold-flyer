"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet, extractDataArray } from "@/lib/api-client";
import { PackageSearch } from "lucide-react";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { animations } from "@/lib/animation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

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

function ProductsGrid({ products }) {
  const results = Array.isArray(products) ? products : [];

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg text-foreground mb-1">No products found</h3>
        <p className="text-muted-foreground text-sm">Try a different search term or clear your filters.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {results.length} product{results.length !== 1 ? "s" : ""} found
      </p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={animations.stagger.fast}
        initial="hidden"
        animate="visible"
      >
        {results.map((product) => (
          <CatalogCard key={product._id || product.id} item={product} type="product" />
        ))}
      </motion.div>
    </div>
  );
}

function ItemsFilters() {
  const { data: products = [] } = useQuery({
    queryKey: ["products-filters"],
    queryFn: async () => {
      const res = await apiGet("/products?limit=200");
      return extractDataArray(res, "products");
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();

  return (
    <CatalogFilters
      type="items"
      filterOptions={[
        { key: "Category", defaultValue: "All Categories", options: ["All Categories", ...categories] },
        { key: "Brand", defaultValue: "All Brands", options: ["All Brands", ...brands] },
      ]}
    />
  );
}

function ItemsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const productType = searchParams.get("producttype") || "";

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products", q, category, brand, productType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (category && category !== "All Categories") params.set("category", category);
      if (brand && brand !== "All Brands") params.set("brand", brand);
      if (productType) params.set("productType", productType);
      params.set("limit", "50");

      const endpoint = params.toString() ? `/products?${params}` : "/products";
      const res = await apiGet(endpoint);
      return extractDataArray(res, "products");
    },
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
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
        <h3 className="font-sans font-bold text-lg text-destructive mb-1">Failed to load products</h3>
        <p className="text-muted-foreground text-sm">Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">
            Results for <span className="text-primary">&quot;{q}&quot;</span>
          </h1>
        </div>
      )}
      <ProductsGrid products={products} />
    </>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
      <ItemsFilters />
      <ItemsContent />
    </Suspense>
  );
}
