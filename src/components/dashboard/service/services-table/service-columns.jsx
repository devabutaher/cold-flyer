import { Checkbox } from "@/components/ui/checkbox";
import {
  AvatarCell,
  PriceCell,
  RatingCell,
  StatusBadge,
} from "../../table/table-cells";
import { Wrench } from "lucide-react";
import { ServiceRowActions } from "./service-row-actions";

export function buildServiceColumns({ onDelete, onEdit } = {}) {
  return [
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

    {
      header: "Service",
      accessorKey: "name",
      cell: ({ row }) => {
        const s = row.original;
        const img = s.images?.[0];
        const src = typeof img === 'string' ? img : img?.url;
        return (
          <div className="flex items-center gap-3 min-w-48">
            {src ? (
              <AvatarCell src={src} name={s.name} avatarShape="rounded" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
            )}
            <span className="font-medium text-sm">{s.name}</span>
          </div>
        );
      },
    },

    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <span className="text-sm capitalize">{row.getValue("category")}</span>
      ),
    },

    {
      header: "Type",
      accessorKey: "serviceType",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground capitalize">
          {row.getValue("serviceType")?.replace(/_/g, " ")}
        </span>
      ),
    },

    {
      header: "Price",
      accessorKey: "basePrice",
      cell: ({ row }) => {
        const s = row.original;
        return <PriceCell price={s.basePrice} priceType={s.priceType} />;
      },
    },

    {
      header: "Bookings",
      accessorKey: "bookingCount",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.getValue("bookingCount") || 0}
        </span>
      ),
    },

    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => <RatingCell rating={row.getValue("rating")} />,
    },

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
          </div>
        );
      },
    },

    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => <ServiceRowActions row={row} onDelete={onDelete} onEdit={onEdit} />,
    },
  ];
}
