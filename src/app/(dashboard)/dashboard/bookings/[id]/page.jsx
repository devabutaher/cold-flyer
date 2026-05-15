"use client";

import { PriceCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useBookingQuery, useCancelBooking } from "@/hooks/queries";
import { useQuery } from "@tanstack/react-query";
import {
  ConfirmBookingDialog,
  ScheduleBookingDialog,
  StartServiceDialog,
  CompleteBookingDialog,
} from "@/components/dashboard/booking/admin-actions/admin-booking-actions";
import { ReviewDialog } from "@/components/dashboard/booking/review/review-dialog";
import { useAuth } from "@/components/providers";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  Home,
  MapPin,
  PencilLine,
  Phone,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BOOKING_STATUS_MAP = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/10 text-green-600 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  rescheduled: {
    label: "Rescheduled",
    className: "bg-orange-500/10 text-orange-600 border-orange-200",
  },
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const { data: booking, isLoading, refetch } = useBookingQuery(id);
  const cancelBooking = useCancelBooking();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { backendUser } = useAuth();
  const isAdmin = backendUser?.role === "admin";

  const { data: technicians = [] } = useQuery({
    queryKey: ["admin-technicians"],
    queryFn: async () => {
      const res = await fetch("/api/admin/technicians?limit=100", { credentials: "include" });
      const data = await res.json();
      return data?.data?.technicians || [];
    },
    enabled: isAdmin,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 text-center">
        <ClipboardList size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground mb-4">Booking not found.</p>
        <Button asChild size="sm">
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const canCancel = ["pending", "confirmed", "scheduled", "in_progress"].includes(booking.status);

  const handleCancel = async () => {
    try {
      await cancelBooking.mutateAsync({
        bookingId: booking._id,
        reason: cancelReason || "Customer request",
      });
      toast.success("Booking cancelled");
      setCancelOpen(false);
      setCancelReason("");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft size={16} />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">Booking {booking.bookingNumber}</h1>
          <p className="text-xs text-muted-foreground">{booking.service?.name}</p>
        </div>
        <StatusBadge value={booking.status} map={BOOKING_STATUS_MAP} />
      </div>

      <div className="grid gap-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays size={15} className="text-primary" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-muted-foreground" />
              <span>
                {booking.scheduledDate
                  ? new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not scheduled"}
              </span>
            </div>
            {booking.scheduledTime?.start && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <span>
                  {booking.scheduledTime.start} - {booking.scheduledTime.end}
                </span>
              </div>
            )}
            {booking.completedAt && (
              <p className="text-xs text-muted-foreground">
                Completed: {new Date(booking.completedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Home size={15} className="text-primary" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm space-y-1.5">
            {booking.propertyDetails?.propertyType && (
              <p>
                <span className="font-medium">Type:</span> {booking.propertyDetails.propertyType}
              </p>
            )}
            {booking.propertyDetails?.size && (
              <p>
                <span className="font-medium">Size:</span> {booking.propertyDetails.size} sq ft
              </p>
            )}
            {booking.propertyDetails?.issues?.length > 0 && (
              <div>
                <p className="font-medium mb-1">Issues:</p>
                <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                  {booking.propertyDetails.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {booking.serviceAddress && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <MapPin size={15} className="text-primary" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-1">
              {booking.serviceAddress.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone size={13} className="text-muted-foreground" />
                  {booking.serviceAddress.phone}
                </p>
              )}
              <p>
                {[
                  booking.serviceAddress.addressLine1,
                  booking.serviceAddress.addressLine2,
                  booking.serviceAddress.city,
                  booking.serviceAddress.state,
                  booking.serviceAddress.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </CardContent>
          </Card>
        )}

        {booking.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText size={15} className="text-primary" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              <p className="text-muted-foreground">{booking.notes}</p>
            </CardContent>
          </Card>
        )}

        {booking.diagnosis && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <AlertCircle size={15} className="text-primary" />
                Diagnosis & Work Done
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-3">
              {booking.diagnosis && (
                <div>
                  <p className="font-medium text-xs uppercase tracking-widest text-muted-foreground mb-1">Diagnosis</p>
                  <p>{booking.diagnosis}</p>
                </div>
              )}
              {booking.workDone && (
                <div>
                  <p className="font-medium text-xs uppercase tracking-widest text-muted-foreground mb-1">Work Done</p>
                  <p>{booking.workDone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceCell price={booking.subtotal} />
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <PriceCell price={-booking.discount} className="text-green-600" />
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <PriceCell price={booking.total} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <StatusBadge
                value={booking.paymentStatus}
                map={{
                  paid: {
                    label: "Paid",
                    className: "bg-green-500/10 text-green-600",
                  },
                  pending: {
                    label: "Pending",
                    className: "bg-amber-500/10 text-amber-600",
                  },
                  partial: {
                    label: "Partial",
                    className: "bg-blue-500/10 text-blue-600",
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {booking.status === "completed" && (booking.customerRating || booking.customerReview) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Customer Review
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm space-y-2">
              {booking.customerRating && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={star <= booking.customerRating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className={star <= booking.customerRating ? "text-yellow-500" : "text-muted-foreground/30"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              )}
              {booking.customerReview && (
                <p className="text-muted-foreground italic">&ldquo;{booking.customerReview}&rdquo;</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 flex-wrap">
          {isAdmin && booking.status !== "cancelled" && (
            <>
              {booking.status === "pending" && <ConfirmBookingDialog booking={booking} onSuccess={refetch} />}
              {booking.status === "confirmed" && (
                <ScheduleBookingDialog booking={booking} onSuccess={refetch} technicians={technicians} />
              )}
              {booking.status === "scheduled" && <StartServiceDialog booking={booking} onSuccess={refetch} />}
              {booking.status === "in_progress" && <CompleteBookingDialog booking={booking} onSuccess={refetch} />}
            </>
          )}
          {booking.status === "completed" && <ReviewDialog booking={booking} onSuccess={refetch} />}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/bookings/edit/${booking._id}`}>
              <PencilLine size={14} className="mr-2" />
              Edit
            </Link>
          </Button>

          {canCancel && (
            <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <XCircle size={14} className="mr-2" />
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Booking <strong>{booking.bookingNumber}</strong> for {booking.service?.name} will be permanently
                    cancelled.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason for cancellation (optional)"
                    rows={2}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={handleCancel}
                  >
                    Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
