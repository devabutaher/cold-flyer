import OfferBanner from "@/components/products/offer-banner";
import ProductDetail from "@/components/products/product-detail";
import { acParts, acUnits } from "@/data/products-data";

export async function generateStaticParams() {
  const all = [...acUnits, ...acParts];
  return all.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const all = [...acUnits, ...acParts];
  const product = all.find((p) => p.id === id);
  return {
    title: product ? `${product.name} | ColdFlyer` : "Product | ColdFlyer",
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  return (
    <>
      <OfferBanner />
      <ProductDetail productId={id} />
    </>
  );
}
