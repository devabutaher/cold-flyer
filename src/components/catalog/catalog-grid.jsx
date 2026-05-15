"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CatalogCard } from "./catalog-card";

export function CatalogGrid({ type = "product", apiFetchFn, queryKey, filterFn, sortFn, itemLabel = "item" }) {
  const {
    data: results,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await apiFetchFn();
      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        throw err;
      }
    },
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <CardSkeleton key={i} type={type} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-destructive mb-4" />
        <h3 className="font-sans font-bold text-lg text-destructive mb-1">Failed to load {type}s</h3>
        <p className="text-muted-foreground text-sm">Please try again later.</p>
      </div>
    );
  }

  const items = Array.isArray(results) ? results : [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg text-foreground mb-1">No {type}s found</h3>
        <p className="text-muted-foreground text-sm">Try a different search term or clear your filters.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {items.length} {itemLabel}
        {items.length !== 1 ? "s" : ""} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CatalogCard key={item._id ?? item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
}

function CardSkeleton({ type }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-48 w-full" />
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className={type === "product" ? "h-9 w-9 rounded-md" : "h-9 w-16"} />
        </div>
      </div>
    </div>
  );
}

export default CatalogGrid;
