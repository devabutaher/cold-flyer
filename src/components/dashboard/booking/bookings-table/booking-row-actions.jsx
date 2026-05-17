"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, XCircle, PencilLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function BookingRowActions({ row, onCancel }) {
  const booking = row.original;
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const canCancel = ["pending", "confirmed", "scheduled", "in_progress"].includes(booking.status);

  const handleCancel = async () => {
    try {
      await onCancel(booking._id, cancelReason || "Customer request");
      setOpen(false);
      setCancelReason("");
    } catch {}
  };

  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <Button variant="ghost" size="icon-sm" asChild>
        <Link href={`/dashboard/bookings/${booking._id}`}>
          <Eye size={15} />
          <span className="sr-only">View</span>
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal size={15} />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/bookings/${booking._id}`}>
              <Eye size={14} className="mr-2" />
              View Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/dashboard/bookings/edit/${booking._id}`}>
              <PencilLine size={14} className="mr-2" />
              Edit Booking
            </Link>
          </DropdownMenuItem>

          {canCancel && (
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <XCircle size={14} className="mr-2 text-destructive" />
                  Cancel Booking
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Booking <strong>{booking.bookingNumber}</strong> for {booking.service?.name} will be cancelled.
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
