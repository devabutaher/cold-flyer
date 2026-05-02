import { acParts, acUnits } from "@/data/products-data";
import ProductCarousel from "./product-carousel";

export default function ShopSection() {
  return (
    <section className="container py-10">
      <div className="space-y-10">
        <ProductCarousel
          title="Premium AC Units"
          tag="Our Store"
          items={acUnits}
          catalogLabel="View Full Catalog"
          catalogLink="/items/ac_units"
        />

        <ProductCarousel
          title="Precision AC Parts"
          tag="Replacements"
          items={acParts}
          catalogLabel="Explore Parts"
          catalogLink="/items/ac_parts"
        />
      </div>
    </section>
  );
}
