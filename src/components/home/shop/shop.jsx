import { acParts, acUnits } from "@/data/products-data";
import CarouselSection from "./product-carousel";

export default function Shop() {
  return (
    <section className="container py-10">
      <div className="space-y-10">
        <CarouselSection
          title="Premium AC Units"
          tag="Our Store"
          items={acUnits}
          catalogLabel="View Full Catalog"
        />

        <CarouselSection
          title="Precision AC Parts"
          tag="Replacements"
          items={acParts}
          catalogLabel="Explore Parts"
        />
      </div>
    </section>
  );
}
