import OfferBanner from "@/components/products/offer-banner";
import ProductDetail from "@/components/products/product-detail";
import productsApi from "@/lib/api/products";

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  try {
    const response = await productsApi.getProductBySlug(slug);
    const product = response.data?.product;
    return {
      title: product ? `${product.name} | ColdFlyer` : "Product | ColdFlyer",
    };
  } catch {
    return { title: "Product | ColdFlyer" };
  }
}

export default async function ProductPage({ params }) {
  const { id: slug } = await params;
  return (
    <>
      <OfferBanner />
      <ProductDetail productSlug={slug} />
    </>
  );
}
