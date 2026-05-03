"use client";

import ProductCard from "@/components/products/product-card";
import { useProductSearch } from "@/hooks/use-product-search";
import { PackageSearch, Loader2 } from "lucide-react";

export default function ProductsGrid({ q, category, brand, sort }) {
  const { products: results, loading, error } = useProductSearch({ q, category, brand, sort });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 size={48} className="text-muted-foreground mb-4 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading products...</p>
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
        <p className="text-muted-foreground text-sm">
          Please try again later.
        </p>
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
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
