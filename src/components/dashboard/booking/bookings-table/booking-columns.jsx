"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { PriceCell, StatusBadge } from "../../table/table-cells";
import { CalendarDays, ClipboardList } from "lucide-react";
import { BookingRowActions } from "./booking-row-actions";

const BOOKING_STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
  scheduled: { label: "Scheduled", className: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  rescheduled: { label: "Rescheduled", className: "bg-orange-500/10 text-orange-600 border-orange-200" },
};

export function buildBookingColumns({ onCancel } = {}) {
  return [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      ),
    },

    {
      header: "Booking #",
      accessorKey: "bookingNumber",
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex items-center gap-3 min-w-36">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-sm font-medium">{b.bookingNumber}</span>
          </div>
        );
      },
    },

    {
      header: "Service",
      accessorKey: "service",
      cell: ({ row }) => {
        const b = row.original;
        return <span className="text-sm min-w-40 block">{b.service?.name || "—"}</span>;
      },
    },

    {
      header: "Customer",
      accessorKey: "user",
      cell: ({ row }) => {
        const b = row.original;
        return <span className="text-sm min-w-32 block">{b.user?.name || "—"}</span>;
      },
    },

    {
      header: "Date",
      accessorKey: "scheduledDate",
      cell: ({ row }) => {
        const b = row.original;
        if (!b.scheduledDate) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-1.5 text-sm min-w-28">
            <CalendarDays size={13} className="text-muted-foreground shrink-0" />
            {new Date(b.scheduledDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
    },

    {
      header: "Total",
      accessorKey: "total",
      cell: ({ row }) => {
        const b = row.original;
        return <PriceCell price={b.total} />;
      },
    },

    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return <StatusBadge value={status} map={BOOKING_STATUS_MAP} />;
      },
    },

    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => <BookingRowActions row={row} onCancel={onCancel} />,
    },
  ];
}
