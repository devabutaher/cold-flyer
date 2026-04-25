import OfferBanner from "@/components/products/offer-banner";
import ProductFilters from "@/components/products/product-filters";

export default function ItemsLayout({ children }) {
  return (
    <div className="container py-10">
      <OfferBanner />
      <ProductFilters />
      {children}
    </div>
  );
}
