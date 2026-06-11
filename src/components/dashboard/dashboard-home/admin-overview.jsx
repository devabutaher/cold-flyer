"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers";
import { getClient } from "@/lib/http-client";
import { StatCard } from "./stat-card";
import { RevenueAreaChart } from "./charts/revenue-area-chart";
import { BookingRevenueChart } from "./charts/booking-revenue-chart";
import { OrderPieChart } from "./charts/order-pie-chart";
import { DailySalesBarChart } from "./charts/daily-sales-bar-chart";
import { BookingBarChart } from "./charts/booking-bar-chart";
import { ServiceCategoryChart } from "./charts/service-category-chart";
import { TopServicesChart } from "./charts/top-services-chart";
import { CustomerGrowthChart } from "./charts/customer-growth-chart";
import { TopProductsChart } from "./charts/top-products-chart";
import { RecentOrdersWidget } from "./widgets/recent-orders-widget";
import { RecentBookingsWidget } from "./widgets/recent-bookings-widget";
import { DateRangeFilter } from "./date-range-filter";
import { ExportButton } from "./export-button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, CalendarCheck, TrendingUp, Percent, AlertCircle } from "lucide-react";

export function AdminOverview() {
  const { backendUser } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    const qs = params.toString();
    return `/admin/dashboard${qs ? `?${qs}` : ""}`;
  }, [startDate, endDate]);

  const keys = ["admin-dashboard"];
  if (startDate) keys.push(startDate.toISOString());
  if (endDate) keys.push(endDate.toISOString());

  const { data, isLoading, isError, error } = useQuery({
    queryKey: keys,
    queryFn: async () => {
      const res = await getClient().get(buildUrl());
      return res.data?.data || {};
    },
    staleTime: 30000,
    gcTime: 1800000,
    refetchInterval: 60000,
    placeholderData: (prev) => prev,
  });

  const handleRangeChange = useCallback((s, e) => {
    setStartDate(s);
    setEndDate(e);
  }, []);

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter startDate={startDate} endDate={endDate} onRangeChange={handleRangeChange} />
          <ExportButton
            data={data?.monthlyRevenue}
            filename="revenue-data"
            columns={[{ label: "Date", key: "_id" }, { label: "Revenue", key: "total" }, { label: "Orders", key: "count" }]}
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Revenue" value={data?.revenue} icon={DollarSign} prefix="৳" loading={isLoading} />
        <StatCard title="Service Revenue" value={data?.serviceRevenue} icon={TrendingUp} prefix="৳" loading={isLoading} />
        <StatCard title="Bookings" value={data?.totalBookings} icon={CalendarCheck} loading={isLoading} />
        <StatCard title="Completion Rate" value={data?.completionRate} icon={Percent} suffix="%" loading={isLoading} />
        <StatCard title="Orders" value={data?.totalOrders} icon={ShoppingCart} loading={isLoading} />
        <StatCard title="Customers" value={data?.totalUsers} icon={Users} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BookingRevenueChart data={data?.bookingRevenueTrend} loading={isLoading} />
        <RevenueAreaChart data={data?.monthlyRevenue} loading={isLoading} />
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
        <CustomerGrowthChart data={data?.customerGrowth} loading={isLoading} />
        <TopProductsChart data={data?.topProducts} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentBookingsWidget bookings={data?.recentBookings} loading={isLoading} />
        <RecentOrdersWidget orders={data?.recentOrders} loading={isLoading} />
      </div>
    </div>
  );
}
