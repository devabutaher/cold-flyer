import OfferBanner from "@/components/products/offer-banner";
import ProductFilters from "@/components/products/product-filters";
import ProductsGrid from "@/components/products/products-grid";
import { Suspense } from "react";

export default async function ACUnitsPage({ searchParams }) {
  const { q, brand, sort } = await searchParams;

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

      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Our Store
          </span>
          <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">
            Premium AC Units
          </h2>
        </div>
        <ProductsGrid
          q={q ?? ""}
          productType="unit"
          brand={brand ?? ""}
          sort={sort ?? ""}
        />
      </div>
    </>
  );
}
