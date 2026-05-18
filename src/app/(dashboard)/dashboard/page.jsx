import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth-server";
import DashboardClient from "@/components/dashboard/stats/dashboard-client";

export const dynamic = "force-dynamic";

async function getUser() {
  try {
    const data = await getCurrentUser();
    return data || null;
  } catch {
    return null;
  }
}

function getPath(h) {
  return h.get("x-invoke-path") || h.get("next-url") || "";
}

export default async function DashboardLayout() {
  const cookieStore = await cookies();
  const user = await getUser();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = getPath(h);
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  if (!user) {
    const h = await headers();
    const p = getPath(h);
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  if (user.role !== "admin") {
    redirect("/dashboard/orders");
  }

  return <DashboardClient userName={user.name} />;
}
