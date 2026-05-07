import { Checkbox } from "@/components/ui/checkbox";
import {
  AvatarCell,
  MonoCell,
  PriceCell,
  RatingCell,
  StatusBadge,
} from "../../table/table-cells";
import { Wrench } from "lucide-react";

export function buildServiceColumns({ onDelete } = {}) {
  return [
    // ── Select ──────────────────────────────────────────
    {
      id: "select",
      size: 44,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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

    // ── Service (icon + name + category) ───────────────
    {
      header: "Service",
      accessorKey: "name",
      cell: ({ row }) => {
        const s = row.original;
        const src = s.image || s.images?.[0]?.url;
        const icon = s.icon;
        return (
          <div className="flex items-center gap-3 min-w-48">
            {src ? (
              <AvatarCell src={src} name={s.name} avatarShape="rounded" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-sm">{s.name}</span>
              {s.sub && (
                <span className="text-xs text-muted-foreground">{s.sub}</span>
              )}
            </div>
          </div>
        );
      },
    },

    // ── Category ─────────────────────────────────────────
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => {
        const val = row.getValue("category");
        return (
          <span className="text-sm capitalize">{val}</span>
        );
      },
    },

    // ── Service Type ───────────────────────────────────
    {
      header: "Type",
      accessorKey: "serviceType",
      cell: ({ row }) => {
        const val = row.getValue("serviceType");
        return (
          <span className="text-sm text-muted-foreground capitalize">
            {val?.replace(/_/g, " ")}
          </span>
        );
      },
    },

    // ── Price ────────────────────────────────────────────
    {
      header: "Price",
      accessorKey: "basePrice",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <PriceCell
            price={s.basePrice}
            originalPrice={null}
            priceType={s.priceType}
          />
        );
      },
    },

    // ── Duration ────────────────────────────────────────
    {
      header: "Duration",
      accessorKey: "duration",
      cell: ({ row }) => {
        const d = row.original.duration;
        if (!d) return <span className="text-muted-foreground">—</span>;
        return (
          <span className="text-sm">
            {d.value} {d.unit}
          </span>
        );
      },
    },

    // ── Bookings ──────────────────────────────────────
    {
      header: "Bookings",
      accessorKey: "bookingCount",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.getValue("bookingCount") || 0}
        </span>
      ),
    },

    // ── Rating ─────────────────────────────────────────
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => <RatingCell rating={row.getValue("rating")} />,
    },

    // ── Status ──────────────────────────────────────────
    {
      header: "Status",
      accessorKey: "isFeatured",
      cell: ({ row }) => {
        const s = row.original;
        return (
          <div className="flex items-center gap-2">
            {s.isFeatured && (
              <StatusBadge
                value="Featured"
                map={{
                  Featured: {
                    label: "Featured",
                    className: "bg-primary/10 text-primary",
                  },
                }}
              />
            )}
            <StatusBadge
              value={s.isActive ? "Active" : "Inactive"}
              map={{
                Active: {
                  label: "Active",
                  className: "bg-green-500/10 text-green-600",
                },
                Inactive: {
                  label: "Inactive",
                  className: "bg-muted text-muted-foreground",
                },
              }}
            />
          </div>
        );
      },
    },

    // ── Actions ─────────────────────────────────────────
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => <ServiceRowActions row={row} onDelete={onDelete} />,
    },
  ];
}

function ServiceRowActions({ row, onDelete }) {
  const s = row.original;
  
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
      </button>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(s._id ?? s.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      )}
    </div>
  );
}