import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

export default async function DashboardLayout() {
  const cookieStore = await cookies();
  const user = await getUser();

  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }

  if (!user) {
    redirect("/auth");
  }

  if (user.role !== "admin") {
    redirect("/dashboard/orders");
  }

  return <DashboardClient userName={user.name} />;
}
