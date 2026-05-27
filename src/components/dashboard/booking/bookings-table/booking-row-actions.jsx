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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  ConfirmBookingDialog,
  ScheduleBookingDialog,
  StartServiceDialog,
  CompleteBookingDialog,
} from "@/components/dashboard/booking/admin-actions/admin-booking-actions";
import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";
import { Eye, MoreHorizontal, PencilLine, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function BookingRowActions({ row, onCancel, isAdmin = false, userRole }) {
  const booking = row.original;
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const canManage = userRole ? ["admin", "moderator"].includes(userRole) : isAdmin;
  const canOperate = userRole ? ["admin", "moderator", "worker"].includes(userRole) : isAdmin;

  const { data: technicians = [] } = useQuery({
    queryKey: ["admin-technicians"],
    queryFn: async () => {
      const res = await getClient().get("/admin/technicians?limit=100");
      return res.data?.data?.technicians || [];
    },
    enabled: canManage,
  });

  const canCancel = ["pending", "confirmed", "scheduled", "in_progress"].includes(booking.status);

  const handleCancel = async () => {
    try {
      await onCancel(booking._id, cancelReason || "Customer request");
      setCancelOpen(false);
      setCancelReason("");
    } catch {}
  };

  return (
    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
      {canManage && booking.status === "pending" && (
        <ConfirmBookingDialog
          booking={booking}
          onSuccess={() => {}}
          triggerClassName="h-7 px-2.5 text-xs gap-1"
          triggerVariant="default"
        />
      )}
      {canManage && booking.status === "confirmed" && (
        <ScheduleBookingDialog
          booking={booking}
          onSuccess={() => {}}
          technicians={technicians}
          triggerClassName="h-7 px-2.5 text-xs gap-1"
          triggerVariant="default"
        />
      )}
      {canOperate && booking.status === "scheduled" && (
        <StartServiceDialog
          booking={booking}
          onSuccess={() => {}}
          triggerClassName="h-7 px-2.5 text-xs gap-1"
          triggerVariant="default"
        />
      )}
      {canOperate && booking.status === "in_progress" && (
        <CompleteBookingDialog
          booking={booking}
          onSuccess={() => {}}
          triggerClassName="h-7 px-2.5 text-xs gap-1"
          triggerVariant="default"
        />
      )}

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal size={15} />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/bookings/${booking._id}`} className="flex items-center w-full">
                <Eye size={14} className="mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>

            {canManage && (
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/bookings/edit/${booking._id}`} className="flex items-center w-full">
                  <PencilLine size={14} className="mr-2" />
                  Edit Booking
                </Link>
              </DropdownMenuItem>
            )}

            {canCancel && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <XCircle size={14} className="mr-2 text-destructive" />
                  Cancel Booking
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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
    </div>
  );
}
