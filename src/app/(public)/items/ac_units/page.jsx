"use client";

import { Suspense, useEffect, useState } from "react";
import { apiGet } from "@/lib/api-client";
import { PackageSearch } from "lucide-react";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ACUnitsPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiGet("/products?productType=unit&limit=200");
        let data = [];
        if (Array.isArray(res)) data = res;
        else if (Array.isArray(res?.data)) data = res.data;
        else if (Array.isArray(res?.data?.products)) data = res.data.products;
        else if (Array.isArray(res?.products)) data = res.products;

        setProducts(data);
        const brds = [...new Set(data.map((p) => p.brand).filter(Boolean))].sort();
        setBrands(brds);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg">Failed to load products</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Our Store</span>
        <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">Premium AC Units</h2>
      </div>
      {brands.length > 0 && (
        <CatalogFilters
          type="items"
          filterOptions={[
            { key: "Brand", defaultValue: "All Brands", options: ["All Brands", ...brands] },
          ]}
        />
      )}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <PackageSearch size={48} className="text-muted-foreground mb-4" />
          <h3 className="font-sans font-bold text-lg">No products found</h3>
        </div>
      ) : (
        <div>
          <p className="text-xs text-muted-foreground mb-4">{products.length} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <CatalogCard key={product._id || product.id} item={product} type="product" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
