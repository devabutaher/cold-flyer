import OfferBanner from "@/components/products/offer-banner";
import ProductFilters from "@/components/products/product-filters";
import ProductsGrid from "@/components/products/products-grid";
import { Suspense } from "react";

export default async function ACPartsPage({ searchParams }) {
  const { q, brand, sort } = await searchParams;

  return (
    <>
      <OfferBanner />
      <Suspense fallback={null}>
        <ProductFilters />
      </Suspense>
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Replacements
          </span>
          <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">
            Precision AC Parts
          </h2>
        </div>
        <ProductsGrid
          q={q ?? ""}
          productType="part"
          brand={brand ?? ""}
          sort={sort ?? ""}
        />
      </div>
    </>
  );
}