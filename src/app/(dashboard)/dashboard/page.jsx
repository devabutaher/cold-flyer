import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/api/master";

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
  
  // No access token = redirect to login
  if (!cookieStore.get("accessToken")) {
    redirect("/auth");
  }
  
  // Not logged in = redirect
  if (!user) {
    redirect("/auth");
  }
  
  // Non-admin users can only access orders
  if (user.role !== "admin") {
    redirect("/dashboard/orders");
  }
  
  // Admin gets full dashboard
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.name}</p>
    </div>
  );
}