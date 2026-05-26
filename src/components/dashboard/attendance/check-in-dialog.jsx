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

export function CheckInDialog({ worker, open, onOpenChange, onSuccess }) {
  const [location, setLocation] = useState("");
  const [task, setTask] = useState("");
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gettingGps, setGettingGps] = useState(false);
  const checkinMutation = useCheckinMutation();

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

  const handleCheckIn = async () => {
    try {
      await checkinMutation.mutateAsync({
        workerId: worker._id,
        location: location || gpsCoords ? `${gpsCoords?.lat},${gpsCoords?.lng}` : undefined,
        task: task || undefined,
      });
      toast.success(`${worker.workerName} checked in.`);
      setLocation("");
      setTask("");
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
        <AlertDialogHeader>
          <AlertDialogTitle>Check In — {worker.workerName}</AlertDialogTitle>
          <AlertDialogDescription>Record check-in details for this worker.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="mb-1.5 block text-xs">Location</Label>
            <div className="flex gap-2">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location manually"
                className="h-9 flex-1"
              />
              <Button variant="outline" size="sm" onClick={handleGetGps} disabled={gettingGps} className="shrink-0">
                <MapPin size={14} className={gettingGps ? "animate-pulse" : ""} />
              </Button>
            </div>
            {gpsCoords && (
              <p className="text-xxs text-muted-foreground mt-1">
                GPS: {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-1.5 block text-xs">Task</Label>
            <Textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe today's task"
              rows={2}
              className="resize-none"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCheckIn} disabled={checkinMutation.isPending}>
            {checkinMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
            Confirm Check-In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
