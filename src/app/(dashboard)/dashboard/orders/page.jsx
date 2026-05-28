import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const OrdersContent = await import("@/components/dashboard/orders/orders-page").then((mod) => mod.default);

  return <OrdersContent />;
}
