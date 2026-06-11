"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { CalendarCheck } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
  rescheduled: { label: "Rescheduled", className: "bg-orange-500/10 text-orange-600" },
};

export const RecentBookingsWidget = memo(function RecentBookingsWidget({ bookings, loading, title = "Recent Bookings" }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!bookings?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">No bookings yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.slice(0, 6).map((booking) => (
          <div key={booking._id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <CalendarCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs truncate">
                  {booking.bookingNumber || `#${booking._id?.slice(-6).toUpperCase()}`}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {booking.service?.name || "Service Booking"}
                </p>
              </div>
            </div>
            <StatusBadge value={booking.status} map={STATUS_MAP} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
