"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { getClient } from "@/lib/http-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Phone, Smartphone, Loader2 } from "lucide-react";
import Link from "next/link";

/* ── Worker Location Card ──────────────────────────────── */
function LocationWorkerCard({ worker }) {
  const latestLog = worker.latestLog;
  const isOnline = worker.status === "online";

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                isOnline ? "bg-green-500" : "bg-muted-foreground"
              }`}
            />
            <CardTitle className="text-sm font-semibold">{worker.workerName}</CardTitle>
          </div>
          <Badge variant={isOnline ? "default" : "secondary"} className="text-xxs">
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone size={13} />
          <span>{worker.phone || "—"}</span>
        </div>

        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin size={13} className="mt-0.5 shrink-0" />
          <span className="text-foreground">{worker.currentLocation?.lat ? `${worker.currentLocation.lat}, ${worker.currentLocation.lng}` : worker.latestLog?.address || "No location data"}</span>
        </div>

        {latestLog?.lat && latestLog?.lng && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-xs"
              asChild
            >
              <Link
                href={`https://www.google.com/maps?q=${latestLog.lat},${latestLog.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={13} />
                Open in Google Maps
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Location Log Table ─────────────────────────────────── */
const mapLogRow = (l) => ({
  workerName: l.workerName || "—",
  time: l.time || "—",
  address: l.address || "—",
  task: l.task || "—",
  lat: l.lat,
  lng: l.lng,
});

const LOG_PDF_COLUMNS = [
  { header: "Worker", accessorKey: "workerName", width: 1.5 },
  { header: "Time", accessorKey: "time", width: 1 },
  { header: "Address", accessorKey: "address", width: 2 },
  { header: "Task", accessorKey: "task", width: 1.5 },
];

function buildLocationLogColumns() {
  return [
    {
      header: "Worker",
      accessorKey: "workerName",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("workerName") || "—"}</span>,
    },
    {
      header: "Time",
      accessorKey: "time",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("time") || "—"}</span>,
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ row }) => <span className="text-sm">{row.getValue("address") || "—"}</span>,
    },
    {
      header: "Task",
      accessorKey: "task",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("task") || "—"}</span>,
    },
    {
      header: "Map",
      id: "map",
      cell: ({ row }) => {
        const l = row.original;
        if (!l.lat || !l.lng) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <Button variant="ghost" size="xs" className="gap-1" asChild>
            <Link
              href={`https://www.google.com/maps?q=${l.lat},${l.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation size={12} />
              Maps
            </Link>
          </Button>
        );
      },
    },
  ];
}

/* ── Main Page ──────────────────────────────────────────── */
export default function LocationPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-location"],
    queryFn: async () => {
      const res = await getClient().get("/location");
      return res.data?.data || { workers: [], todayLog: [] };
    },
  });

  const workers = data?.workers || [];
  const todayLog = data?.todayLog || [];
  const columns = useMemo(() => buildLocationLogColumns(), []);

  const onlineCount = workers.filter((w) => w.status === "online").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Live Location</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {onlineCount} worker{onlineCount !== 1 ? "s" : ""} currently online.
        </p>
      </div>

      {/* Worker Cards */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse w-2/3 mb-4" />
                <div className="h-3 bg-muted rounded animate-pulse w-full mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
          <MapPin size={40} className="opacity-40" />
          <p className="text-sm">No worker locations available.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker) => (
            <LocationWorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      )}

      {/* Today's Location Log */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-4">Today&apos;s Location Log</h2>
        <DataTable
          columns={columns}
          data={todayLog}
          loading={isLoading}
          rowCount="entries"
          defaultSort={[]}
          emptyMessage="No location updates today."
          emptyIcon={<MapPin size={40} />}
          toolbar={(table) => (
            <TableToolbar
              table={table}
              searchPlaceholder="Search log..."
              selectedLabel="entries"
              filters={[]}
              actions={
                <ExportMenu
                  table={table}
                  filename="location-log"
                  mapRow={mapLogRow}
                  pdfTitle="ColdFlyer — Location Log"
                  pdfColumns={LOG_PDF_COLUMNS}
                />
              }
            />
          )}
        />
      </div>
    </div>
  );
}
