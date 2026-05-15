"use client";

import { useState } from "react";
import { useBookingsQuery } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ClipboardList, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function MyBookingsPage() {
  const { backendUser, loading: authLoading } = useAuth();
  const { data: bookings = [], isLoading } = useBookingsQuery();
  const [filter, setFilter] = useState("all");

  if (authLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!backendUser) {
    return (
      <div className="container py-16 text-center">
        <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-xl font-semibold mb-2">Sign in to view your bookings</h1>
        <p className="text-sm text-muted-foreground mb-4">You need to be signed in to see your service bookings.</p>
        <Button asChild>
          <Link href="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage your service appointments</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/services">
            <Wrench size={14} className="mr-2" />
            Browse Services
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "scheduled", "completed", "cancelled"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
            className="capitalize"
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <ClipboardList size={40} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No bookings found.</p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href="/services">Book a Service</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Link key={booking._id} href={`/dashboard/bookings/${booking._id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-medium text-muted-foreground">
                          {booking.bookingNumber}
                        </span>
                        <StatusBadge value={booking.status} map={STATUS_MAP} />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{booking.service?.name || "Service"}</h3>
                      {booking.scheduledDate && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarDays size={12} />
                          {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {booking.scheduledTime?.start && (
                            <>
                              {" "}
                              &middot; {booking.scheduledTime.start} - {booking.scheduledTime.end}
                            </>
                          )}
                        </p>
                      )}
                      {booking.serviceAddress && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />
                          {[booking.serviceAddress.city, booking.serviceAddress.state].filter(Boolean).join(", ") ||
                            "Address set"}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">৳{booking.total?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{booking.paymentStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
