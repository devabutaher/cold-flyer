"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers";
import { StatsCards } from "@/components/dashboard/stats/stats-cards";
import { RecentOrders, TopProducts } from "@/components/dashboard/stats/dashboard-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { getClient } from "@/lib/http-client";

export default function DashboardClient() {
  const { backendUser } = useAuth();
  const userRole = backendUser?.role;
  const isAdmin = userRole === "admin";

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await getClient().get("/admin/dashboard");
      return res.data?.data || {};
    },
    enabled: isAdmin,
    refetchInterval: isAdmin ? 60000 : undefined,
  });

  if (!isAdmin) {
    const roleLabel = { moderator: "Moderator", worker: "Worker", customer: "Customer" }[userRole] || "User";
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {backendUser?.name} <span className="text-xs ml-1 text-primary">({roleLabel})</span>
          </p>
        </div>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">Use the sidebar to navigate to your available sections.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
      </div>

      <StatsCards data={data} loading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders orders={data?.recentOrders} loading={isLoading} />
        <TopProducts products={data?.topProducts} loading={isLoading} />
      </div>
    </div>
  );
}
