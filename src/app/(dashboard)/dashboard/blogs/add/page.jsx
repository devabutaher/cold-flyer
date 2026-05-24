import { getCurrentUser } from "@/lib/auth-server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function AddBlogPage() {
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

  const AddBlogForm = await import("@/components/dashboard/blog/add-blog/add-blog-form").then(
    (mod) => mod.default,
  );

  return <AddBlogForm isAdmin={user.role === "admin"} />;
}
