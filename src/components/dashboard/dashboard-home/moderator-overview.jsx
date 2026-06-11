"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers";
import { getClient } from "@/lib/http-client";
import { StatCard } from "./stat-card";
import { OrderPieChart } from "./charts/order-pie-chart";
import { BookingBarChart } from "./charts/booking-bar-chart";
import { ServiceCategoryChart } from "./charts/service-category-chart";
import { TopServicesChart } from "./charts/top-services-chart";
import { RecentOrdersWidget } from "./widgets/recent-orders-widget";
import { RecentBookingsWidget } from "./widgets/recent-bookings-widget";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, CalendarCheck, Percent, AlertCircle } from "lucide-react";

export function ModeratorOverview() {
  const { backendUser } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["moderator-dashboard"],
    queryFn: async () => {
      const res = await getClient().get("/dashboard/moderator");
      return res.data?.data || {};
    },
    staleTime: 30000,
    gcTime: 1800000,
    refetchInterval: 60000,
    placeholderData: (prev) => prev,
  });

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Moderator Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm font-medium">Failed to load dashboard data</p>
            <p className="text-xs text-muted-foreground">{error?.message || "An unexpected error occurred"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Moderator Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Service Revenue" value={data?.serviceRevenue} icon={TrendingUp} prefix="৳" loading={isLoading} />
        <StatCard title="Bookings" value={data?.totalBookings} icon={CalendarCheck} loading={isLoading} />
        <StatCard title="Completion Rate" value={data?.completionRate} icon={Percent} suffix="%" loading={isLoading} />
        <StatCard title="Customers" value={data?.totalCustomers} icon={Users} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ServiceCategoryChart data={data?.serviceCategoryBreakdown} loading={isLoading} />
        <TopServicesChart data={data?.topServices} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BookingBarChart data={data?.bookingStatusDistribution} loading={isLoading} />
        <OrderPieChart data={data?.orderStatusDistribution} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentBookingsWidget bookings={data?.recentBookings} loading={isLoading} />
        <RecentOrdersWidget orders={data?.recentOrders} loading={isLoading} />
      </div>
    </div>
  );
}
