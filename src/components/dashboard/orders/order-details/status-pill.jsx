const ORDER_STATUS = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  processing: {
    label: "Processing",
    className: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-500/10 text-green-600 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refunded: {
    label: "Refunded",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const PAYMENT_STATUS = {
  paid: {
    label: "Paid",
    className: "bg-green-500/10 text-green-600 border-green-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refunded: {
    label: "Refunded",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const ORDER_STATUSES = ORDER_STATUS;
export const PAYMENT_STATUSES = PAYMENT_STATUS;

export function StatusPill({ value, map }) {
  const cfg = map[value] ?? {
    label: value,
    className: "bg-secondary text-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}