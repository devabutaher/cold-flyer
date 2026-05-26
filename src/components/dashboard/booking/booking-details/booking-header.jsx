"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { ArrowLeft } from "lucide-react";

const BOOKING_STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  rescheduled: { label: "Rescheduled", className: "bg-orange-500/10 text-orange-600 border-orange-200" },
};

function formatDateTime(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingHeader({ booking }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
        <Link href="/dashboard/bookings">
          <ArrowLeft size={16} />
          <span className="sr-only">Back</span>
        </Link>
      </Button>
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight truncate">Booking {booking.bookingNumber}</h1>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{booking.service?.name}</span>
          <span>·</span>
          <span>{formatDateTime(booking.createdAt)}</span>
        </div>
      </div>
      <StatusBadge value={booking.status} map={BOOKING_STATUS_MAP} />
    </div>
  );
}
