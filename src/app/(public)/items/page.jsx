import OfferBanner from "@/components/products/offer-banner";
import ProductFilters from "@/components/products/product-filters";
import ProductsGrid from "@/components/products/products-grid";

export default async function ItemsPage({ searchParams }) {
  const { q, category, brand, sort } = await searchParams;

  return (
    <>
      <OfferBanner />
      {q && (
        <div className="mt-4">
          <h1 className="font-sans font-bold text-2xl text-foreground">
            Results for <span className="text-primary">"{q}"</span>
          </h1>
        </div>
      )}
      <ProductFilters />
      <ProductsGrid
        q={q ?? ""}
        category={category ?? ""}
        brand={brand ?? ""}
        sort={sort ?? ""}
      />
    </>
  );
}
