import OfferBanner from "@/components/products/offer-banner";

export default function ItemsLayout({ children }) {
  return (
    <div className="container py-10">
      <OfferBanner />
      {children}
    </div>
  );
}
