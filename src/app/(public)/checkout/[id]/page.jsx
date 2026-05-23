import { CheckoutPage } from "@/components/checkout/checkout-page";

export default async function Page({ params }) {
  const { id } = await params;
  return <CheckoutPage orderId={id} />;
}
