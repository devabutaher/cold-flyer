import ProductCard from "@/components/home/shop/product-card";
import ProductFilters from "@/components/products/product-filters";
import { acParts, acUnits } from "@/data/products-data";

export default function ItemsPage() {
  return (
    <>
      <ProductFilters />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {acUnits.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {acParts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
