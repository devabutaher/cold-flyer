"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/dashboard/stats/stats-cards";
import { RecentOrders, TopProducts } from "@/components/dashboard/stats/dashboard-cards";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchDashboard() {
  const res = await fetch("/api/admin/dashboard", { credentials: "include" });
  const data = await res.json();
  return data?.data || {};
}

export default function DashboardClient({ userName }) {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboard,
    refetchInterval: 60000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back, {userName}
        </p>
      </div>

      <StatsCards data={data} loading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders orders={data?.recentOrders} loading={isLoading} />
        <TopProducts products={data?.topProducts} loading={isLoading} />
      </div>
    </div>
  );
}
