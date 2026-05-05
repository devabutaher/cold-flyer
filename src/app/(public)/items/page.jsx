import { Suspense } from "react";
import OfferBanner from "@/components/products/offer-banner";
import ProductFilters from "@/components/products/product-filters";
import ProductsGrid from "@/components/products/products-grid";

export default async function ItemsPage({ searchParams }) {
  const { q, category, brand, sort } = await searchParams;

  return (
    <>
      <OfferBanner />
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
        <ProductFilters />
      </Suspense>
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">
            Results for <span className="text-primary">&quot;{q}&quot;</span>
          </h1>
        </div>
      )}
      <ProductsGrid
        q={q ?? ""}
        category={category ?? ""}
        brand={brand ?? ""}
        sort={sort ?? ""}
      />
    </>
  );
}
