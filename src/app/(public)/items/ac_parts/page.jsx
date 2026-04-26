import ProductCard from "@/components/products/product-card";
import ProductFilters from "@/components/products/product-filters";
import { acParts } from "@/data/products-data";

export default function ACParts() {
  return (
    <>
      <ProductFilters />
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Replacements
          </span>
          <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">
            Precision AC Parts
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {acParts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
