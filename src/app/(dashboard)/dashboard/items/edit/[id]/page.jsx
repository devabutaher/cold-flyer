import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import EditProductForm from "@/components/dashboard/product/edit-product/edit-product-form";
import { getProductBySlugServer } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await getProductBySlugServer(id);
    return {
      title: product ? `Edit ${product.name} | ColdFlyer` : "Edit Product | ColdFlyer",
    };
  } catch {
    return { title: "Edit Product | ColdFlyer" };
  }
}

export default async function EditProductPage({ params }) {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const { id: slugOrId } = await params;

  let product = null;
  try {
    product = await getProductBySlugServer(slugOrId);
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return <EditProductForm product={product} isAdmin={user.role === "admin"} />;
}
