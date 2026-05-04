import productsApi from "@/lib/api/products";
import ProductCarousel from "./product-carousel";

async function getProductsByType(productType) {
  try {
    const response = await productsApi.getProducts({ productType, limit: 10 });
    return response.data?.products || response.products || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ShopSection() {
  const [acUnits, acParts] = await Promise.all([
    getProductsByType("unit"),
    getProductsByType("part"),
  ]);

  return (
    <section className="container py-10">
      <div className="space-y-10">
        {acUnits.length > 0 && (
          <div key="ac-units">
            <ProductCarousel
              title="Premium AC Units"
              tag="Our Store"
              items={acUnits}
              catalogLabel="View Full Catalog"
              catalogLink="/items?productType=unit"
            />
          </div>
        )}

        {acParts.length > 0 && (
          <div key="ac-parts">
            <ProductCarousel
              title="Precision AC Parts"
              tag="Replacements"
              items={acParts}
              catalogLabel="Explore Parts"
              catalogLink="/items?productType=part"
            />
          </div>
        )}
      </div>
    </section>
  );
}
