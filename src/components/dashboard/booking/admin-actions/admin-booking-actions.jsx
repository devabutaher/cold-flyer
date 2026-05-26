"use client";

import { ScheduleSection } from "@/components/dashboard/booking/booking-form";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCompleteBooking, useConfirmBooking, useScheduleBooking, useStartService } from "@/hooks/queries/bookings";
import { CalendarDays, CheckCircle2, Loader2, PlayCircle, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleBookingSchema } from "@/validations";
import { toast } from "sonner";

export function ConfirmBookingDialog({ booking, onSuccess, triggerClassName, triggerVariant = "outline" }) {
  const [open, setOpen] = useState(false);
  const confirmBooking = useConfirmBooking();

  const handleSubmit = async () => {
    try {
      await confirmBooking.mutateAsync(booking._id);
      setOpen(false);
      onSuccess?.();
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size="sm" className={triggerClassName}>
          <ThumbsUp size={14} className="mr-2" />
          Confirm
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Acknowledge booking <strong>{booking.bookingNumber}</strong> for {booking.service?.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={confirmBooking.isPending}>
            {confirmBooking.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Confirming...
              </>
            ) : (
              "Confirm Booking"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ScheduleBookingDialog({
  booking,
  onSuccess,
  technicians = [],
  triggerClassName,
  triggerVariant = "outline",
}) {
  const [open, setOpen] = useState(false);
  const [technician, setTechnician] = useState(booking.technician?._id || "");
  const scheduleBooking = useScheduleBooking();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      scheduledDate: booking.scheduledDate ? new Date(booking.scheduledDate).toISOString().split("T")[0] : "",
      scheduledTime: {
        start: booking.scheduledTime?.start || "",
        end: booking.scheduledTime?.end || "",
      },
    },
    resolver: zodResolver(scheduleBookingSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      await scheduleBooking.mutateAsync({
        id: booking._id,
        data: {
          scheduledDate: values.scheduledDate,
          scheduledTime: values.scheduledTime,
          ...(technician && { technician }),
        },
      });
      setOpen(false);
      onSuccess?.();
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size="sm" className={triggerClassName}>
          <CalendarDays size={14} className="mr-2" />
          Schedule
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="data-[size=default]:sm:max-w-[700px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Schedule Booking</AlertDialogTitle>
          <AlertDialogDescription>Set date, time, and technician for {booking.bookingNumber}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <ScheduleSection control={control} />
          {errors.scheduledDate && <p className="text-xs text-destructive mt-2">{errors.scheduledDate.message}</p>}
          {errors.scheduledTime?.start && (
            <p className="text-xs text-destructive mt-1">{errors.scheduledTime.start.message}</p>
          )}
          {errors.scheduledTime?.end && (
            <p className="text-xs text-destructive mt-1">{errors.scheduledTime.end.message}</p>
          )}
          {technicians.length > 0 && (
            <div className="mt-4">
              <Label>Technician</Label>
              <Select value={technician} onValueChange={setTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.user?.name || t.employeeId || t._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit(onSubmit)} disabled={scheduleBooking.isPending}>
            {scheduleBooking.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              "Confirm Schedule"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function StartServiceDialog({ booking, onSuccess, triggerClassName, triggerVariant = "outline" }) {
  const [open, setOpen] = useState(false);
  const startService = useStartService();

  const handleSubmit = async () => {
    try {
      await startService.mutateAsync(booking._id);
      setOpen(false);
      onSuccess?.();
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size="sm" className={triggerClassName}>
          <PlayCircle size={14} className="mr-2" />
          Start Service
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start this service?</AlertDialogTitle>
          <AlertDialogDescription>
            Mark booking <strong>{booking.bookingNumber}</strong> as in progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={startService.isPending}>
            {startService.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Starting...
              </>
            ) : (
              "Start Service"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CompleteBookingDialog({ booking, onSuccess, triggerClassName, triggerVariant = "outline" }) {
  const [open, setOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState(booking.diagnosis || "");
  const [workDone, setWorkDone] = useState(booking.workDone || "");
  const completeBooking = useCompleteBooking();

  const handleSubmit = async () => {
    try {
      await completeBooking.mutateAsync({ id: booking._id, data: { diagnosis, workDone } });
      setOpen(false);
      onSuccess?.();
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size="sm" className={triggerClassName}>
          <CheckCircle2 size={14} className="mr-2" />
          Complete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Booking</AlertDialogTitle>
          <AlertDialogDescription>Record the work done for {booking.bookingNumber}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Diagnosis</Label>
            <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="What was the issue?"
              rows={3}
            />
          </div>
          <div>
            <Label>Work Done</Label>
            <Textarea
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              placeholder="What was done to fix it?"
              rows={3}
              required
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={completeBooking.isPending}>
            {completeBooking.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Completing...
              </>
            ) : (
              "Mark Completed"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
