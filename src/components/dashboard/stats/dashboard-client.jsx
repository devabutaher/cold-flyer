"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/dashboard/stats/stats-cards";
import { RecentOrders, TopProducts } from "@/components/dashboard/stats/dashboard-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { getClient } from "@/lib/http-client";
import { useAuth } from "@/components/providers";

export default function DashboardClient() {
  const { backendUser } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await getClient().get("/admin/dashboard");
      return res.data?.data || {};
    },
    refetchInterval: 60000,
  });

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
