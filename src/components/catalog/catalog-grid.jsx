"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CatalogCard, MemoizedCatalogCard } from "./catalog-card";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function CatalogGrid({
  type = "product",
  apiFetchFn,
  queryKey,
  filterFn,
  sortFn,
  itemLabel = "item",
  items: externalItems,
  isLoading: externalLoading,
  error: externalError,
}) {
  const hasExternalData = externalItems !== undefined;

  const query = useQuery({
    queryKey: hasExternalData ? ["__catalog_disabled__"] : queryKey,
    queryFn: hasExternalData
      ? async () => []
      : async () => {
          try {
            return await apiFetchFn();
          } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            throw err;
          }
        },
    enabled: !hasExternalData && !!apiFetchFn,
  });

  const t = useTranslations("common");
  const items = hasExternalData ? (externalItems ?? []) : (query.data ?? []);
  const loading = hasExternalData ? (externalLoading ?? false) : query.isLoading;
  const error = hasExternalData ? externalError : query.error;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <CardSkeleton key={i} type={type} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <PackageSearch size={48} className="text-destructive mb-4" />
        <h3 className="font-sans font-bold text-lg text-destructive mb-1">{t("failedToLoad", { type })}</h3>
        <p className="text-muted-foreground text-sm">{t("pleaseTryAgain")}</p>
      </motion.div>
    );
  }

  const results = Array.isArray(items) ? items : [];

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <PackageSearch size={48} className="text-muted-foreground mb-4" />
        <h3 className="font-sans font-bold text-lg text-foreground mb-1">{t("noItemsFound", { type })}</h3>
        <p className="text-muted-foreground text-sm">{t("tryDifferentSearch")}</p>
      </motion.div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4 font-medium">
        {t("resultCount", { count: results.length, label: itemLabel })}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {results.map((item) => (
          <MemoizedCatalogCard key={item._id ?? item.id} item={item} type={type} animate={false} />
        ))}
      </div>
    </div>
  );
}

function CardSkeleton({ type }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-36 sm:h-48 w-full" />
      <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
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
