import { acParts, acUnits } from "@/data/shop-data";
import CarouselSection from "./product-carousel";

export default function Shop() {
  return (
    <section className="bg-background py-16">
      <div className="container">
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
