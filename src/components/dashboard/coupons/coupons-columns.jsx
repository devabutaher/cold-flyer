import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, MonoCell } from "@/components/dashboard/table/table-cells";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const ACTIVE_MAP = {
  true: { label: "Active", className: "bg-green-500/10 text-green-600" },
  false: { label: "Inactive", className: "bg-destructive/10 text-destructive" },
};

const DISCOUNT_TYPE_MAP = {
  percentage: { label: "Percentage", className: "bg-blue-500/10 text-blue-600" },
  fixed: { label: "Fixed", className: "bg-purple-500/10 text-purple-600" },
  free_shipping: { label: "Free Shipping", className: "bg-teal-500/10 text-teal-600" },
};

export function buildCouponColumns({ onDelete, onEdit } = {}) {
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
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => <MonoCell value={row.getValue("code")} />,
    },
    {
      header: "Discount",
      accessorKey: "discountValue",
      cell: ({ row }) => {
        const c = row.original;
        const value = c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{value}</span>
            <StatusBadge value={c.discountType} map={DISCOUNT_TYPE_MAP} />
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "discountType",
      cell: ({ row }) => <StatusBadge value={row.getValue("discountType")} map={DISCOUNT_TYPE_MAP} />,
      meta: { filterVariant: "select" },
    },
    {
      header: "Usage",
      id: "usage",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <span className="text-sm tabular-nums">
            {c.usedCount || 0}
            {c.maxUsage ? ` / ${c.maxUsage}` : ""}
          </span>
        );
      },
    },
    {
      header: "Valid Period",
      id: "validPeriod",
      cell: ({ row }) => {
        const c = row.original;
        const from = c.validFrom ? new Date(c.validFrom).toLocaleDateString() : "—";
        const until = c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "—";
        return (
          <span className="text-sm text-muted-foreground">
            {from} – {until}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => <StatusBadge value={String(!!row.getValue("isActive"))} map={ACTIVE_MAP} />,
      meta: { filterVariant: "select" },
    },
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(row.original);
            }}
          >
            <Pencil size={14} className="text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row.original._id);
            }}
          >
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}
