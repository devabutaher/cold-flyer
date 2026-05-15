"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
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
import {
  useConfirmBooking,
  useScheduleBooking,
  useStartService,
  useCompleteBooking,
} from "@/hooks/queries";
import { CalendarDays, CheckCircle2, Loader2, PlayCircle, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export function ConfirmBookingDialog({ booking, onSuccess }) {
  const [open, setOpen] = useState(false);
  const confirmBooking = useConfirmBooking();

  const handleSubmit = async () => {
    try {
      await confirmBooking.mutateAsync(booking._id);
      toast.success("Booking confirmed");
      setOpen(false);
      onSuccess?.();
    } catch { toast.error("Failed to confirm booking"); }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
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
            {confirmBooking.isPending ? <><Loader2 size={14} className="animate-spin mr-2" />Confirming...</> : "Confirm Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ScheduleBookingDialog({ booking, onSuccess, technicians = [] }) {
  const [open, setOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(
    booking.scheduledDate ? new Date(booking.scheduledDate).toISOString().split("T")[0] : ""
  );
  const [timeStart, setTimeStart] = useState(booking.scheduledTime?.start || "");
  const [timeEnd, setTimeEnd] = useState(booking.scheduledTime?.end || "");
  const [technician, setTechnician] = useState(booking.technician?._id || "");
  const scheduleBooking = useScheduleBooking();

  const handleSubmit = async () => {
    if (!scheduledDate || !timeStart || !timeEnd) {
      toast.error("Please fill in date and time");
      return;
    }
    try {
      await scheduleBooking.mutateAsync({
        id: booking._id,
        data: { scheduledDate, scheduledTime: { start: timeStart, end: timeEnd }, ...(technician && { technician }) },
      });
      toast.success("Booking scheduled");
      setOpen(false);
      onSuccess?.();
    } catch { toast.error("Failed to schedule booking"); }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarDays size={14} className="mr-2" />
          Schedule
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Schedule Booking</AlertDialogTitle>
          <AlertDialogDescription>Set date, time, and technician for {booking.bookingNumber}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} required />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} required />
            </div>
          </div>
          {technicians.length > 0 && (
            <div>
              <Label>Technician</Label>
              <Select value={technician} onValueChange={setTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map(t => (
                    <SelectItem key={t._id} value={t._id}>{t.user?.name || t.employeeId || t._id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={scheduleBooking.isPending}>
            {scheduleBooking.isPending ? <><Loader2 size={14} className="animate-spin mr-2" />Scheduling...</> : "Confirm Schedule"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function StartServiceDialog({ booking, onSuccess }) {
  const [open, setOpen] = useState(false);
  const startService = useStartService();

  const handleSubmit = async () => {
    try {
      await startService.mutateAsync(booking._id);
      toast.success("Service started");
      setOpen(false);
      onSuccess?.();
    } catch { toast.error("Failed to start service"); }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
            {startService.isPending ? <><Loader2 size={14} className="animate-spin mr-2" />Starting...</> : "Start Service"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CompleteBookingDialog({ booking, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState(booking.diagnosis || "");
  const [workDone, setWorkDone] = useState(booking.workDone || "");
  const completeBooking = useCompleteBooking();

  const handleSubmit = async () => {
    try {
      await completeBooking.mutateAsync({ id: booking._id, data: { diagnosis, workDone } });
      toast.success("Booking completed");
      setOpen(false);
      onSuccess?.();
    } catch { toast.error("Failed to complete booking"); }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
            <Textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="What was the issue?" rows={3} />
          </div>
          <div>
            <Label>Work Done</Label>
            <Textarea value={workDone} onChange={e => setWorkDone(e.target.value)} placeholder="What was done to fix it?" rows={3} required />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={completeBooking.isPending}>
            {completeBooking.isPending ? <><Loader2 size={14} className="animate-spin mr-2" />Completing...</> : "Mark Completed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
