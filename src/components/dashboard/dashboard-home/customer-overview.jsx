"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers";
import { getClient } from "@/lib/http-client";
import { StatCard } from "./stat-card";
import { OrderPieChart } from "./charts/order-pie-chart";
import { RecentOrdersWidget } from "./widgets/recent-orders-widget";
import { RecentBookingsWidget } from "./widgets/recent-bookings-widget";
import { UpcomingBookingsWidget } from "./widgets/upcoming-bookings-widget";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, ShoppingCart, Wallet, Clock, AlertCircle } from "lucide-react";

export function CustomerOverview() {
  const { backendUser } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: async () => {
      const res = await getClient().get("/dashboard/customer");
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
          <h1 className="text-xl font-semibold tracking-tight">My Dashboard</h1>
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
        <h1 className="text-xl font-semibold tracking-tight">My Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Bookings" value={data?.totalBookings} icon={CalendarCheck} loading={isLoading} />
        <StatCard title="Active Services" value={data?.activeBookings} icon={Clock} loading={isLoading} />
        <StatCard title="Service Spent" value={data?.serviceSpent} icon={Wallet} prefix="৳" loading={isLoading} />
        <StatCard title="Total Orders" value={data?.totalOrders} icon={ShoppingCart} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrderPieChart data={data?.bookingStatusDistribution} title="My Bookings" loading={isLoading} />
        <UpcomingBookingsWidget bookings={data?.upcomingBookings} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrderPieChart data={data?.orderStatusDistribution} title="My Orders" loading={isLoading} />
        <RecentOrdersWidget orders={data?.recentOrders} title="My Recent Orders" loading={isLoading} />
      </div>
    </div>
  );
}
