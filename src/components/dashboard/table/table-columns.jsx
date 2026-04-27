import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { RowActions } from "./table-row-actions";
import { TagBadge } from "./table-shared";
import { useState } from "react";

export function buildColumns({ onDelete }) {
  return [
    {
      id: "select",
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
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      size: 40,
    },
    {
      header: "Product",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-45">
          <Avatar className="rounded-md w-10 h-10 shrink-0">
            <AvatarImage src={row.original.img} alt={row.original.name} />
            <AvatarFallback className="text-xs rounded-md">
              {row.original.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm text-foreground leading-tight">
              {row.original.name}
            </div>
            <TagBadge tag={row.original.tag} />
          </div>
        </div>
      ),
    },
    {
      header: "SKU",
      accessorKey: "sku",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.getValue("sku")}
        </span>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("category")}</span>
      ),
      meta: { filterVariant: "select" },
    },
    {
      header: "Brand",
      accessorKey: "brand",
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.getValue("brand")}</span>
      ),
      meta: { filterVariant: "select" },
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => {
        const price = row.getValue("price");
        const original = row.original.originalPrice;
        const hasDiscount = original > price;
        return (
          <div>
            <div className="font-bold text-sm text-foreground">
              ৳{price.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">
                ৳{original.toLocaleString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock");
        return (
          <span
            className={cn(
              "text-sm font-medium",
              stock === 0
                ? "text-destructive"
                : stock <= 10
                  ? "text-amber-600"
                  : "text-green-600",
            )}
          >
            {stock === 0 ? "Out" : stock}
          </span>
        );
      },
    },
    {
      header: "Warranty",
      accessorKey: "warranty",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("warranty")}
        </span>
      ),
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="text-primary text-sm">★</span>
          <span className="text-sm font-medium">{row.getValue("rating")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActions row={row} onDelete={onDelete} />,
      enableSorting: false,
      size: 48,
    },
  ];
}
