"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { useCheckinMutation } from "@/hooks/queries/attendance";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkinSchema = z.object({
  location: z.string().optional(),
  task: z.string().optional(),
});

export function CheckInDialog({ worker, open, onOpenChange, onSuccess }) {
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gettingGps, setGettingGps] = useState(false);
  const checkinMutation = useCheckinMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", task: "" },
    resolver: zodResolver(checkinSchema),
    mode: "onTouched",
  });

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not available.");
      return;
    }
    setGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGettingGps(false);
        toast.success("GPS location acquired.");
      },
      () => {
        setGettingGps(false);
        toast.error("Failed to get GPS location.");
      },
    );
  };

  const onSubmit = async (data) => {
    try {
      await checkinMutation.mutateAsync({
        workerId: worker._id,
        location: data.location || gpsCoords ? `${gpsCoords?.lat},${gpsCoords?.lng}` : undefined,
        task: data.task || undefined,
      });
      toast.success(`${worker.workerName} checked in.`);
      reset();
      setGpsCoords(null);
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Check-in failed.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Check In — {worker.workerName}</AlertDialogTitle>
            <AlertDialogDescription>Record check-in details for this worker.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-1.5 block text-xs">Location</Label>
              <div className="flex gap-2">
                <Controller
                  name="location"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setGpsCoords(null);
                      }}
                      placeholder="Enter location manually"
                      className="h-9 flex-1"
                      aria-invalid={fieldState.invalid}
                    />
                  )}
                />
                <Button variant="outline" size="sm" onClick={handleGetGps} disabled={gettingGps} className="shrink-0">
                  <MapPin size={14} className={gettingGps ? "animate-pulse" : ""} />
                </Button>
              </div>
              {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
              {gpsCoords && (
                <p className="text-xxs text-muted-foreground mt-1">
                  GPS: {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Task</Label>
              <Controller
                name="task"
                control={control}
                render={({ field, fieldState }) => (
                  <Textarea
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Describe today's task"
                    rows={2}
                    className="resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />
              {errors.task && <p className="text-xs text-destructive mt-1">{errors.task.message}</p>}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={checkinMutation.isPending}>
              {checkinMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              Confirm Check-In
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
