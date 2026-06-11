"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { getClient } from "@/lib/http-client";
import { History } from "lucide-react";

const ACTIVITY_TYPE_MAP = {
  create: { label: "Create", className: "bg-green-500/10 text-green-600" },
  update: { label: "Update", className: "bg-blue-500/10 text-blue-600" },
  delete: { label: "Delete", className: "bg-red-500/10 text-red-600" },
  login: { label: "Login", className: "bg-purple-500/10 text-purple-600" },
  logout: { label: "Logout", className: "bg-orange-500/10 text-orange-600" },
  other: { label: "Other", className: "bg-muted text-muted-foreground" },
};

const mapRow = (l) => ({
  date: l.date || "—",
  time: l.time || "—",
  user: l.user?.name || l.userUID || "—",
  action: l.action || "—",
  type: l.type || "other",
  detail: l.detail || "—",
});

const PDF_COLUMNS = [
  { header: "Date", accessorKey: "date", width: 1 },
  { header: "Time", accessorKey: "time", width: 0.8 },
  { header: "User", accessorKey: "user", width: 1.5 },
  { header: "Action", accessorKey: "action", width: 2 },
  { header: "Type", accessorKey: "type", width: 1 },
  { header: "Detail", accessorKey: "detail", width: 2.5 },
];

export default function ActivityLogTable() {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const res = await getClient().get("/activity");
      return res.data?.data?.logs || [];
    },
  });

  const userOptions = useMemo(() => {
    const users = [...new Set(logs.map((l) => l.user?.name || l.userUID).filter(Boolean))];
    return users.sort();
  }, [logs]);

  const typeOptions = ["create", "update", "delete", "login", "logout", "other"];

  const columns = useMemo(
    () => [
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
        header: "Date",
        accessorKey: "date",
        id: "date",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("date") || "—"}</span>,
      },
      {
        header: "Time",
        accessorKey: "time",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("time") || "—"}</span>,
      },
      {
        header: "User",
        accessorKey: "user.name",
        id: "user",
        cell: ({ row }) => {
          const l = row.original;
          return <span className="text-sm font-medium">{l.user?.name || l.userUID || "—"}</span>;
        },
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => <span className="text-sm">{row.getValue("action") || "—"}</span>,
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => <StatusBadge value={row.getValue("type") || "other"} map={ACTIVITY_TYPE_MAP} />,
        meta: { filterVariant: "select" },
      },
      {
        header: "Detail",
        accessorKey: "detail",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground max-w-[250px] truncate block">
            {row.getValue("detail") || "—"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={logs}
        loading={isLoading}
        error={error}
        rowCount="logs"
      defaultSort={[{ id: "date", desc: true }]}
      emptyMessage="No activity logs found."
      searchFields={["user.name", "userUID", "action", "type", "date", "time"]}
      emptyIcon={<History size={40} />}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search logs..."
          selectedLabel="logs"
          filters={[
            {
              columnId: "user",
              placeholder: "All Users",
              allLabel: "All Users",
              options: userOptions,
            },
            {
              columnId: "type",
              placeholder: "All Types",
              allLabel: "All Types",
              options: typeOptions,
            },
          ]}
          actions={
            <ExportMenu
              table={table}
              filename="activity-log"
              mapRow={mapRow}
              pdfTitle="ColdFlyer — Activity Log"
              pdfColumns={PDF_COLUMNS}
            />
          }
        />
      )}
    />
  );
}
