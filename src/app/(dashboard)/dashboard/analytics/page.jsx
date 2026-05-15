"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, DollarSign, CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/table/table-cells";

async function fetcher(url) {
  const res = await fetch(url, { credentials: "include" });
  return res.json();
}

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

function StatCard({ title, value, icon: Icon, loading, prefix }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div className="text-2xl font-bold">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetcher("/api/admin/analytics");
      return res?.data || {};
    },
  });

  const services = data?.services;
  const sales = data?.sales;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Sales and service performance</p>
      </div>

      {services && (
        <>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BarChart size={15} className="text-primary" /> Service Analytics
          </h2>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Bookings" value={services.totalBookings} icon={CalendarDays} loading={isLoading} />
            <StatCard title="Completed" value={services.completedBookings} icon={BarChart} loading={isLoading} />
            <StatCard title="Revenue" value={services.revenue} icon={DollarSign} loading={isLoading} prefix="৳" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bookings by Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.byStatus?.map((s) => (
                  <div key={s._id} className="flex items-center justify-between text-sm">
                    <StatusBadge value={s._id} map={STATUS_MAP} />
                    <span className="font-medium">{s.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bookings by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {services.byCategory?.map((c) => (
                  <div key={c._id} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{c._id}</span>
                    <span className="font-medium">{c.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {sales && (
        <>
          <h2 className="text-sm font-semibold flex items-center gap-2 mt-6">
            <DollarSign size={15} className="text-primary" /> Sales Analytics
          </h2>

          {sales.categorySales?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sales.categorySales.map((c) => (
                  <div key={c._id} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{c._id}</span>
                    <span className="font-medium">
                      ৳{c.total?.toLocaleString()} ({c.count} items)
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {sales.dailySales?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Daily Sales (last 30 days)</CardTitle>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto space-y-1">
                {[...sales.dailySales].reverse().map((d) => (
                  <div key={d._id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{d._id}</span>
                    <span className="font-medium">
                      ৳{d.total?.toLocaleString()} ({d.count} orders)
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!isLoading && !services && !sales && (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No analytics data available
          </CardContent>
        </Card>
      )}
    </div>
  );
}
