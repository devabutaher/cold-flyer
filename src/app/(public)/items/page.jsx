"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

function ProductsGrid({ products }) {
  const results = Array.isArray(products) ? products : [];

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
          <CatalogCard key={product._id || product.id} item={product} type="product" />
        ))}
      </div>
    </div>
  );
}

function ItemsFilters() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await apiGet("/products?limit=200");
        let products = [];
        if (Array.isArray(res)) products = res;
        else if (Array.isArray(res?.data)) products = res.data;
        else if (Array.isArray(res?.data?.products)) products = res.data.products;
        else if (Array.isArray(res?.products)) products = res.products;

        const cats = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
        const brds = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
        setCategories(cats);
        setBrands(brds);
      } catch (err) {
        console.error("Error fetching filters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  if (loading) {
    return (
      <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
        <div className="ml-auto w-48 h-8 bg-muted animate-pulse rounded" />
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

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const productType = searchParams.get("producttype") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (q) params.set("search", q);
        if (category && category !== "All Categories") params.set("category", category);
        if (brand && brand !== "All Brands") params.set("brand", brand);
        if (productType) params.set("productType", productType);
        params.set("limit", "50");

        const endpoint = params.toString() ? `/products?${params}` : "/products";
        const res = await apiGet(endpoint);

        let data = [];
        if (Array.isArray(res)) data = res;
        else if (Array.isArray(res?.data)) data = res.data;
        else if (Array.isArray(res?.data?.products)) data = res.data.products;
        else if (Array.isArray(res?.products)) data = res.products;

        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q, category, brand, productType]);

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

  return (
    <>
      <Suspense fallback={<div className="h-12 bg-muted animate-pulse rounded" />}>
        <ItemsFilters />
      </Suspense>
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
