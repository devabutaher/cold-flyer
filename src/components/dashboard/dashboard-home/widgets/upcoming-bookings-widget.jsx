"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { Calendar, Clock, MapPin } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
};

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString();
};

export const UpcomingBookingsWidget = memo(function UpcomingBookingsWidget({ bookings, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Upcoming Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!bookings?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Upcoming Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">No upcoming services</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Upcoming Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0 mt-0.5">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">
                  {booking.service?.name || "Service"}
                </p>
                <StatusBadge value={booking.status} map={STATUS_MAP} />
              </div>
              {booking.scheduledDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(booking.scheduledDate)}
                  {booking.scheduledTime?.start && (
                    <>
                      <Clock className="h-3 w-3 ml-1" />
                      {booking.scheduledTime.start}
                    </>
                  )}
                </p>
              )}
              {booking.serviceAddress && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {typeof booking.serviceAddress === "string"
                    ? booking.serviceAddress
                    : booking.serviceAddress?.address || booking.serviceAddress?.thana || ""}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
