"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { XCircle } from "lucide-react";
import { useCancelBooking } from "@/hooks/queries/bookings";

export function BookingCancelDialog({ booking }) {
  const cancelBooking = useCancelBooking();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancel = async () => {
    try {
      await cancelBooking.mutateAsync({
        bookingId: booking._id,
        reason: cancelReason || "Customer request",
      });
      setCancelOpen(false);
      setCancelReason("");
    } catch {}
  };

  return (
    <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
        >
          <XCircle size={14} />
          Cancel Booking
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Booking <strong>{booking.bookingNumber}</strong> for {booking.service?.name} will be permanently cancelled.
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
  );
}
