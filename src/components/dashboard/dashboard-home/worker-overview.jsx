"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/providers";
import { getClient } from "@/lib/http-client";
import { StatCard } from "./stat-card";
import { BookingBarChart } from "./charts/booking-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { CalendarCheck, Briefcase, Clock, CheckCircle2, Star, TrendingUp, AlertCircle } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

export function WorkerOverview() {
  const { backendUser } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["worker-dashboard"],
    queryFn: async () => {
      const res = await getClient().get("/dashboard/worker");
      return res.data?.data || {};
    },
    staleTime: 30000,
    gcTime: 1800000,
    refetchInterval: 120000,
    placeholderData: (prev) => prev,
  });

  const todayBookings = data?.todayBookings || [];
  const monthlyStats = data?.monthlyStats || {};
  const attendance = data?.attendance || {};

  const monthlyData = useMemo(
    () => Object.entries(monthlyStats).map(([key, count]) => ({ _id: key, count })),
    [monthlyStats]
  );

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Worker Dashboard</h1>
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
        <h1 className="text-xl font-semibold tracking-tight">Worker Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {backendUser?.name}</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard title="Today&apos;s Jobs" value={todayBookings.length} icon={CalendarCheck} loading={isLoading} />
        <StatCard title="This Month" value={data?.totalJobsThisMonth} icon={Briefcase} loading={isLoading} />
        <StatCard title="Completed" value={monthlyStats?.completed || 0} icon={CheckCircle2} loading={isLoading} />
        <StatCard title="Avg Rating" value={data?.averageRating} icon={Star} suffix={data?.averageRating ? "/5" : ""} loading={isLoading} />
        <StatCard title="Revenue Generated" value={data?.revenueGenerated} icon={TrendingUp} prefix="৳" loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : todayBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No bookings scheduled today</p>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((booking) => (
                  <div key={booking._id} className="flex items-start justify-between text-sm border-b pb-2 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{booking.service?.name || "Service"}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.scheduledTime?.start || "—"} — {booking.scheduledTime?.end || "—"}
                      </p>
                      {booking.customerName && (
                        <p className="text-xs text-muted-foreground">{booking.customerName}</p>
                      )}
                    </div>
                    <StatusBadge value={booking.status} map={STATUS_MAP} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">{attendance.present || 0}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-3xl text-muted-foreground">/</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{attendance.total || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Days</div>
                  </div>
                </div>
                {attendance.total > 0 && (
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${((attendance.present || 0) / attendance.total) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {monthlyData.length > 0 && (
        <BookingBarChart data={monthlyData} title="Monthly Job Status" loading={isLoading} />
      )}
    </div>
  );
}
