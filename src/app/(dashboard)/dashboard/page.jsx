import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import DashboardHome from "@/components/dashboard/dashboard-home/dashboard-home";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function DashboardLayout() {
  const cookieStore = await cookies();

  if (!cookieStore.get("accessToken")) {
    const h = await headers();
    const p = h.get("x-invoke-path") || h.get("next-url") || "";
    redirect(`/auth${p ? `?redirect=${encodeURIComponent(p)}` : ""}`);
  }

  return <DashboardHome />;
}
