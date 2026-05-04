"use client";

import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductSearch } from "@/hooks/use-product-search";
import { PackageSearch } from "lucide-react";

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

export default function ProductsGrid({ q, category, brand, sort, productType }) {
  const {
    products: results,
    loading,
    error,
  } = useProductSearch({ q, category, brand, sort, productType });

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

  if (!results || !Array.isArray(results)) {
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
        {results.map((product) => {
          return <ProductCard key={product._id} product={product} />;
        })}
      </div>
    </div>
  );
}
