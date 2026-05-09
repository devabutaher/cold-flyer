import OfferBanner from "@/components/products/offer-banner";

export default function ServicesLayout({ children }) {
  return (
    <div className="container py-10">
      <OfferBanner />
      {children}
    </div>
  );
}
