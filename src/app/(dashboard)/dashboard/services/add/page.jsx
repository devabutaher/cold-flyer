import { getCurrentUser } from "@/lib/auth-server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Add Service" };
export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data;
  } catch {
    return null;
  }
}

export default async function AddServicePage() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  const user = await getUser();

  if (!user || !["admin", "moderator"].includes(user.role)) {
    redirect("/");
  }

  const AddServiceForm = await import("@/components/dashboard/service/add-service/add-service-form").then(
    (mod) => mod.default,
  );

  return <AddServiceForm isAdmin={true} />;
}
