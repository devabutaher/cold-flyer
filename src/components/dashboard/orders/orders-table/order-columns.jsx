import { MonoCell, PriceCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import { CalendarDays, Package } from "lucide-react";
import { OrderRowActions } from "./order-row-actions";

// ── Badge config maps ────────────────────────────────────────
const ORDER_STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600" },
  processing: {
    label: "Processing",
    className: "bg-indigo-500/10 text-indigo-600",
  },
  shipped: { label: "Shipped", className: "bg-primary/10 text-primary" },
  delivered: {
    label: "Delivered",
    className: "bg-green-500/10 text-green-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
  },
  refunded: {
    label: "Refunded",
    className: "bg-destructive/10 text-destructive",
  },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
};

const PAYMENT_STATUS_MAP = {
  paid: { label: "Paid", className: "bg-green-500/10 text-green-600" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
  refunded: {
    label: "Refunded",
    className: "bg-destructive/10 text-destructive",
  },
  partially_refunded: {
    label: "Partial Refund",
    className: "bg-orange-500/10 text-orange-600",
  },
};

/**
 * buildOrderColumns({ onPay, onCancel, payingOrderId })
 */
export function buildOrderColumns({ onPay, onCancel, payingOrderId }) {
  return [
    // ── Order number ─────────────────────────────────
    {
      header: "Order",
      accessorKey: "orderNumber",
      cell: ({ row }) => {
        const o = row.original;
        const label = o.orderNumber ?? `#${o._id?.slice(-8).toUpperCase()}`;
        return <MonoCell value={label} />;
      },
    },

    // ── Date ─────────────────────────────────────────
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const d = row.getValue("createdAt");
        if (!d) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays size={12} />
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
    },

    // ── Customer ─────────────────────────────────────
    {
      header: "Customer",
      accessorKey: "user.name",
      cell: ({ row }) => {
        const o = row.original;
        return <span className="text-sm font-medium min-w-32 block">{o.user?.name || "—"}</span>;
      },
    },

    // ── Item count ───────────────────────────────────
    {
      header: "Items",
      accessorKey: "itemCount",
      cell: ({ row }) => {
        const count = row.getValue("itemCount") ?? 0;
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package size={12} />
            {count} {count === 1 ? "item" : "items"}
          </div>
        );
      },
    },

    // ── Total ────────────────────────────────────────
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ row }) => <PriceCell price={row.getValue("total")} />,
    },

    // ── Order status ─────────────────────────────────
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge value={row.getValue("status")} map={ORDER_STATUS_MAP} />,
      meta: { filterVariant: "select" },
    },

    // ── Payment status ───────────────────────────────
    {
      header: "Payment",
      accessorKey: "paymentStatus",
      cell: ({ row }) => <StatusBadge value={row.getValue("paymentStatus")} map={PAYMENT_STATUS_MAP} />,
      meta: { filterVariant: "select" },
    },

    // ── Actions ──────────────────────────────────────
    {
      id: "actions",
      enableSorting: false,
      header: "",
      cell: ({ row }) => (
        <OrderRowActions order={row.original} onPay={onPay} onCancel={onCancel} payingOrderId={payingOrderId} />
      ),
    },
  ];
}
