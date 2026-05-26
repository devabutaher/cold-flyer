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
} from "@/components/ui/alert-dialog";
import { useCheckoutMutation } from "@/hooks/queries/attendance";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CheckOutDialog({ worker, open, onOpenChange, onSuccess }) {
  const checkoutMutation = useCheckoutMutation();

  const handleCheckOut = async () => {
    try {
      await checkoutMutation.mutateAsync({
        workerId: worker._id,
        attendanceId: worker.attendance?._id,
      });
      toast.success(`${worker.workerName} checked out.`);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Check-out failed.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Check Out — {worker.workerName}</AlertDialogTitle>
          <AlertDialogDescription>
            Confirm check-out for {worker.workerName}. They checked in at {worker.attendance?.inTime || "—"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCheckOut} disabled={checkoutMutation.isPending}>
            {checkoutMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
            Confirm Check-Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
