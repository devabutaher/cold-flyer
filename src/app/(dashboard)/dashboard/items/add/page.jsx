import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

export default async function AddProductPage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const AddProductForm = await import("@/components/dashboard/product/add-product/add-product-form").then(
    (mod) => mod.default,
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <AddProductForm isAdmin={user.role === "admin"} />
    </div>
  );
}
