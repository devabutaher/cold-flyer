"use client";

import { useMemo, useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users } from "lucide-react";
import { getClient } from "@/lib/http-client";
import { WorkerCard } from "./worker-card";
import { CheckInDialog } from "./check-in-dialog";
import { CheckOutDialog } from "./check-out-dialog";
import { ATTENDANCE_STATUS_MAP, mapHistoryRow, HISTORY_PDF_COLUMNS } from "./attendance-utils";

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
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("workerName") || "\u2014"}</span>,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("date") || "\u2014"}</span>,
    },
    {
      header: "In Time",
      accessorKey: "inTime",
      cell: ({ row }) => <span className="text-sm">{row.getValue("inTime") || "\u2014"}</span>,
    },
    {
      header: "Out Time",
      accessorKey: "outTime",
      cell: ({ row }) => <span className="text-sm">{row.getValue("outTime") || "\u2014"}</span>,
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("location") || "\u2014"}</span>,
    },
    {
      header: "Task",
      accessorKey: "task",
      cell: ({ row }) => <span className="text-sm">{row.getValue("task") || "\u2014"}</span>,
    },
    {
      header: "Total Time",
      id: "totalTime",
      cell: ({ row }) => {
        const r = row.original;
        return <span className="text-sm font-medium">{r.totalTime || "\u2014"}</span>;
      },
    },
  ];
}

function TodaySkeleton() {
  return (
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
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
      <Icon size={40} className="opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [checkInWorker, setCheckInWorker] = useState(null);
  const [checkOutWorker, setCheckOutWorker] = useState(null);

  const { data: todayData = [], isLoading: todayLoading, refetch: refetchToday } = useQuery({
    queryKey: ["attendance-today"],
    queryFn: async () => {
      const res = await getClient().get("/attendance/today");
      return res.data?.data?.workers || [];
    },
  });

  const { data: historyData = [], isLoading: historyLoading } = useQuery({
    queryKey: ["attendance-history"],
    queryFn: async () => {
      const res = await getClient().get("/attendance/history");
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

      {checkInWorker && (
        <CheckInDialog
          worker={checkInWorker}
          open={!!checkInWorker}
          onOpenChange={() => setCheckInWorker(null)}
          onSuccess={handleModalSuccess}
        />
      )}
      {checkOutWorker && (
        <CheckOutDialog
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

        <TabsContent value="today" className="mt-6">
          {todayLoading ? (
            <TodaySkeleton />
          ) : todayData.length === 0 ? (
            <EmptyState icon={Users} message="No workers found for today." />
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

        <TabsContent value="history" className="mt-6">
          <DataTable
            columns={historyColumns}
            data={historyData.map(mapHistoryRow)}
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
                    pdfTitle="ColdFlyer \u2014 Attendance History"
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
