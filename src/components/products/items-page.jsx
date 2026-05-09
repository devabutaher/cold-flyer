"use client";

import { Suspense, useEffect, useState } from "react";

import productsApi from "@/lib/api/products";
import { sortOptions } from "@/data/filtering-options";
import { useProductSearch } from "@/hooks/use-product-search";
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
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";

  const { products, loading, error } = useProductSearch({
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
        <h3 className="font-sans font-bold text-lg text-destructive mb-1">
          Failed to load products
        </h3>
        <p className="text-muted-foreground text-sm">Please try again later.</p>
      </div>
    );
  }

  const results = products || [];

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg text-foreground mb-1">
          No products found
        </h3>
        <p className="text-muted-foreground text-sm">
          Try a different search term or clear your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {results.length} product{results.length !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((product) => (
          <CatalogCard key={product._id} item={product} type="product" />
        ))}
      </div>
    </div>
  );
}

export function ItemsPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  return (
    <>
      <Suspense
        fallback={
          <div className="py-4 flex items-center gap-3 overflow-x-auto min-w-0">
            <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Filters:
              </span>
            </div>
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="ml-auto w-48 h-8 bg-muted animate-pulse rounded" />
          </div>
        }
      >
        <ItemsFilters />
      </Suspense>
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">
            Results for <span className="text-primary">&quot;{q}&quot;</span>
          </h1>
        </div>
      )}
      <ProductsGrid />
    </>
  );
}

export default function ItemsPage() {
  return <ItemsPageContent />;
}

function ItemsFilters() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await productsApi.getProducts({ limit: 100 });
        const data = res.data?.products || res.products || [];
        setProducts(data);
        setCategories([...new Set(data.map((p) => p.category).filter(Boolean))].sort());
        setBrands([...new Set(data.map((p) => p.brand).filter(Boolean))].sort());
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
      </div>
    );
  }

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