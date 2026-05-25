"use client";

import { useMemo, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { getClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Clock,
  ClipboardCheck,
  LogIn,
  LogOut,
  MapPin,
  Smartphone,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

/* ── Attendance Status Map ─────────────────────────────── */
const ATTENDANCE_STATUS_MAP = {
  present: { label: "Present", className: "bg-green-500/10 text-green-600" },
  absent: { label: "Absent", className: "bg-red-500/10 text-red-600" },
  late: { label: "Late", className: "bg-amber-500/10 text-amber-600" },
  leave: { label: "On Leave", className: "bg-blue-500/10 text-blue-600" },
};

/* ── History Row Mapper ────────────────────────────────── */
const mapHistoryRow = (r) => ({
  workerName: r.workerName || "—",
  date: r.date ? new Date(r.date).toLocaleDateString() : "—",
  inTime: r.inTime || "—",
  outTime: r.outTime || "—",
  location: r.location || "—",
  task: r.task || "—",
  totalTime: r.inTime && r.outTime ? calcDuration(r.inTime, r.outTime) : "—",
});

function calcDuration(inTime, outTime) {
  const parse = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const diff = parse(outTime) - parse(inTime);
  if (diff <= 0) return "—";
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hrs}h ${mins}m`;
}

const HISTORY_PDF_COLUMNS = [
  { header: "Worker", accessorKey: "workerName", width: 1.5 },
  { header: "Date", accessorKey: "date", width: 1.2 },
  { header: "In Time", accessorKey: "inTime", width: 1 },
  { header: "Out Time", accessorKey: "outTime", width: 1 },
  { header: "Location", accessorKey: "location", width: 1.5 },
  { header: "Task", accessorKey: "task", width: 1.5 },
  { header: "Total Time", accessorKey: "totalTime", width: 1 },
];

/* ── Check-in Modal ────────────────────────────────────── */
function CheckInModal({ worker, open, onOpenChange, onSuccess }) {
  const [location, setLocation] = useState("");
  const [task, setTask] = useState("");
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gettingGps, setGettingGps] = useState(false);

  const checkinMutation = useMutation({
    mutationFn: ({ lat, lng }) =>
      getClient().post("/api/attendance/checkin", {
        workerId: worker._id,
        location,
        task,
        lat,
        lng,
      }),
    onSuccess: () => {
      toast.success(`${worker.workerName} checked in.`);
      onSuccess?.();
      onOpenChange(false);
      setLocation("");
      setTask("");
      setGpsCoords(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleGpsCheckin = () => {
    if (!navigator.geolocation) {
      toast.error("GPS not available in this browser.");
      return;
    }
    setGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGpsCoords(coords);
        setGettingGps(false);
        checkinMutation.mutate(coords);
      },
      () => {
        setGettingGps(false);
        toast.error("Failed to get GPS location. Try manual check-in.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleManualCheckin = () => {
    if (!task) {
      toast.error("Please enter a task.");
      return;
    }
    checkinMutation.mutate({ lat: null, lng: null });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Check In — {worker.workerName}</AlertDialogTitle>
          <AlertDialogDescription>Record attendance and task details.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="location" className="mb-1.5 block">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Work location"
            />
          </div>
          <div>
            <Label htmlFor="task" className="mb-1.5 block">
              Task <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Task description"
            />
          </div>
          {gpsCoords && (
            <p className="text-xs text-green-600">
              GPS captured: {gpsCoords.lat.toFixed(6)}, {gpsCoords.lng.toFixed(6)}
            </p>
          )}
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={checkinMutation.isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="outline"
            onClick={handleGpsCheckin}
            disabled={checkinMutation.isPending || gettingGps}
          >
            {gettingGps ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <MapPin size={14} className="mr-1.5" />
            )}
            {gettingGps ? "Getting GPS…" : "Check In with GPS"}
          </Button>
          <Button onClick={handleManualCheckin} disabled={checkinMutation.isPending || gettingGps}>
            {checkinMutation.isPending ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <LogIn size={14} className="mr-1.5" />
            )}
            Check In
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ── Check-out Modal ───────────────────────────────────── */
function CheckOutModal({ worker, open, onOpenChange, onSuccess }) {
  const [note, setNote] = useState("");

  const checkoutMutation = useMutation({
    mutationFn: () =>
      getClient().post("/api/attendance/checkout", {
        workerId: worker._id,
        note,
      }),
    onSuccess: () => {
      toast.success(`${worker.workerName} checked out.`);
      onSuccess?.();
      onOpenChange(false);
      setNote("");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Check Out — {worker.workerName}</AlertDialogTitle>
          <AlertDialogDescription>Record end of shift notes.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="note" className="mb-1.5 block">
              Note
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any notes for checkout…"
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={checkoutMutation.isPending}>Cancel</AlertDialogCancel>
          <Button onClick={() => checkoutMutation.mutate()} disabled={checkoutMutation.isPending}>
            {checkoutMutation.isPending ? (
              <Loader2 size={14} className="mr-1.5 animate-spin" />
            ) : (
              <LogOut size={14} className="mr-1.5" />
            )}
            Check Out
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ── Worker Card ────────────────────────────────────────── */
function WorkerCard({ worker, onCheckIn, onCheckOut }) {
  const att = worker.attendance;
  const isCheckedIn = att && !att.outTime;
  const isComplete = att && att.inTime && att.outTime;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{worker.workerName}</CardTitle>
          {isComplete ? (
            <Badge variant="secondary" className="text-[10px]">
              <ClipboardCheck size={12} className="mr-1" />
              Done
            </Badge>
          ) : isCheckedIn ? (
            <Badge className="bg-green-500/10 text-green-600 border-none text-[10px]">Active</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              Pending
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Phone</span>
          <span className="font-medium text-foreground">{worker.phone || "—"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>NID</span>
          <span className="font-medium text-foreground">{worker.nid || "—"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Blood</span>
          <span className="font-medium text-foreground">{worker.bloodGroup || "—"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Salary</span>
          <span className="font-medium text-foreground">
            {worker.salary ? `৳${worker.salary.toLocaleString()}` : "—"}
          </span>
        </div>

        {att && (
          <>
            <hr className="my-2 border-border/60" />
            <div className="flex justify-between text-muted-foreground">
              <span>In Time</span>
              <span className="font-medium text-foreground">{att.inTime || "—"}</span>
            </div>
            {att.outTime && (
              <div className="flex justify-between text-muted-foreground">
                <span>Out Time</span>
                <span className="font-medium text-foreground">{att.outTime}</span>
              </div>
            )}
            {att.location && (
              <div className="flex justify-between text-muted-foreground">
                <span>Location</span>
                <span className="font-medium text-foreground truncate max-w-[140px]">{att.location}</span>
              </div>
            )}
          </>
        )}

        <div className="pt-3">
          {isComplete ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <ClipboardCheck size={14} className="mr-1.5" />
              Completed
            </Button>
          ) : isCheckedIn ? (
            <Button size="sm" className="w-full" onClick={() => onCheckOut(worker)}>
              <LogOut size={14} className="mr-1.5" />
              Check Out
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={() => onCheckIn(worker)}>
              <LogIn size={14} className="mr-1.5" />
              Check In
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── History Columns ───────────────────────────────────── */
function buildHistoryColumns() {
  return [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
        />
      ),
    },
    {
      header: "Worker",
      accessorKey: "workerName",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("workerName") || "—"}</span>,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("date") || "—"}</span>,
    },
    {
      header: "In Time",
      accessorKey: "inTime",
      cell: ({ row }) => <span className="text-sm">{row.getValue("inTime") || "—"}</span>,
    },
    {
      header: "Out Time",
      accessorKey: "outTime",
      cell: ({ row }) => <span className="text-sm">{row.getValue("outTime") || "—"}</span>,
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("location") || "—"}</span>,
    },
    {
      header: "Task",
      accessorKey: "task",
      cell: ({ row }) => <span className="text-sm">{row.getValue("task") || "—"}</span>,
    },
    {
      header: "Total Time",
      id: "totalTime",
      cell: ({ row }) => {
        const r = row.original;
        const total = r.inTime && r.outTime ? calcDuration(r.inTime, r.outTime) : "—";
        return <span className="text-sm font-medium">{total}</span>;
      },
    },
  ];
}

/* ── Main Page ──────────────────────────────────────────── */
export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [checkInWorker, setCheckInWorker] = useState(null);
  const [checkOutWorker, setCheckOutWorker] = useState(null);

  /* ── Today's data ── */
  const {
    data: todayData = [],
    isLoading: todayLoading,
    refetch: refetchToday,
  } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await getClient().get("/api/attendance/today");
      return res.data?.data?.workers || [];
    },
  });

  /* ── History data ── */
  const {
    data: historyData = [],
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ["attendance-history"],
    queryFn: async () => {
      const res = await getClient().get("/api/attendance/history");
      return res.data?.data?.records || [];
    },
  });

  const handleCheckIn = useCallback((worker) => setCheckInWorker(worker), []);
  const handleCheckOut = useCallback((worker) => setCheckOutWorker(worker), []);

  const handleModalSuccess = useCallback(() => {
    refetchToday();
    queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
  }, [queryClient, refetchToday]);

  const historyColumns = useMemo(() => buildHistoryColumns(), []);

  const workerOptions = useMemo(() => {
    const names = [...new Set(historyData.map((r) => r.workerName).filter(Boolean))];
    return names.sort();
  }, [historyData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage worker attendance and check-ins.</p>
      </div>

      {/* Check-in / Check-out modals */}
      {checkInWorker && (
        <CheckInModal
          worker={checkInWorker}
          open={!!checkInWorker}
          onOpenChange={() => setCheckInWorker(null)}
          onSuccess={handleModalSuccess}
        />
      )}
      {checkOutWorker && (
        <CheckOutModal
          worker={checkOutWorker}
          open={!!checkOutWorker}
          onOpenChange={() => setCheckOutWorker(null)}
          onSuccess={handleModalSuccess}
        />
      )}

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">
            <Clock size={14} className="mr-1.5" />
            Today
          </TabsTrigger>
          <TabsTrigger value="history">
            <Users size={14} className="mr-1.5" />
            History
          </TabsTrigger>
        </TabsList>

        {/* ── Today Tab ── */}
        <TabsContent value="today" className="mt-6">
          {todayLoading ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3 mb-4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-full mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : todayData.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <Users size={40} className="opacity-40" />
              <p className="text-sm">No workers found for today.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {todayData.map((worker) => (
                <WorkerCard
                  key={worker._id}
                  worker={worker}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── History Tab ── */}
        <TabsContent value="history" className="mt-6">
          <DataTable
            columns={historyColumns}
            data={historyData}
            loading={historyLoading}
            rowCount="records"
            defaultSort={[{ id: "date", desc: true }]}
            emptyMessage="No attendance history found."
            emptyIcon={<Users size={40} />}
            toolbar={(table) => (
              <TableToolbar
                table={table}
                searchPlaceholder="Search records..."
                selectedLabel="records"
                filters={[
                  {
                    columnId: "workerName",
                    placeholder: "All Workers",
                    allLabel: "All Workers",
                    options: workerOptions,
                  },
                ]}
                actions={
                  <ExportMenu
                    table={table}
                    filename="attendance-history"
                    mapRow={mapHistoryRow}
                    pdfTitle="ColdFlyer — Attendance History"
                    pdfColumns={HISTORY_PDF_COLUMNS}
                  />
                }
              />
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
