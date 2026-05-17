import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function OrdersPage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  const user = await getUser();

  if (!user || !["admin", "user"].includes(user.role)) {
    redirect("/");
  }

  const isAdmin = user.role === "admin";

  const OrdersPage = await import("@/components/dashboard/orders/orders-page").then((mod) => mod.default);

  return (
    <div className="container mx-auto py-8">
      <OrdersPage isAdmin={isAdmin} />
    </div>
  );
}
