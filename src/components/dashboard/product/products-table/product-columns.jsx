import { Checkbox } from "@/components/ui/checkbox";
import {
  AvatarCell,
  MonoCell,
  PriceCell,
  RatingCell,
  StatusBadge,
  StockCell,
} from "../../table/table-cells";
import { ProductRowActions } from "./product-row -actions";

// Tag badge config
const TAG_MAP = {
  "Best Seller": {
    label: "Best Seller",
    className: "bg-primary/10 text-primary",
  },
  New: { label: "New", className: "bg-blue-500/10 text-blue-600" },
  Sale: { label: "Sale", className: "bg-destructive/10 text-destructive" },
  Hot: { label: "Hot", className: "bg-orange-500/10 text-orange-600" },
};

export function buildProductColumns({ onDelete } = {}) {
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

    // ── Product (avatar + name + tag) ────────────────────
    {
      header: "Product",
      accessorKey: "name",
      cell: ({ row }) => {
        const p = row.original;
        const src = p.images?.[0]?.url ?? p.img;
        return (
          <div className="flex items-center gap-3 min-w-48">
            <AvatarCell src={src} name={p.name} avatarShape="rounded-full" />
            {p.tag && p.tag !== "none" && (
              <StatusBadge value={p.tag} map={TAG_MAP} />
            )}
          </div>
        );
      },
    },

    // ── SKU ──────────────────────────────────────────────
    {
      header: "SKU",
      accessorKey: "sku",
      cell: ({ row }) => <MonoCell value={row.getValue("sku")} />,
    },

    // ── Category ─────────────────────────────────────────
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("category")}</span>
      ),
      meta: { filterVariant: "select" },
    },

    // ── Brand ────────────────────────────────────────────
    {
      header: "Brand",
      accessorKey: "brand",
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.getValue("brand")}</span>
      ),
      meta: { filterVariant: "select" },
    },

    // ── Price ────────────────────────────────────────────
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ row }) => (
        <PriceCell
          price={row.getValue("price")}
          originalPrice={row.original.originalPrice}
        />
      ),
    },

    // ── Stock ────────────────────────────────────────────
    {
      header: "Stock",
      accessorKey: "stock",
      cell: ({ row }) => <StockCell stock={row.getValue("stock")} />,
    },

    // ── Warranty ─────────────────────────────────────────
    {
      header: "Warranty",
      accessorKey: "warranty",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("warranty") || "—"}
        </span>
      ),
    },

    // ── Rating ───────────────────────────────────────────
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => <RatingCell rating={row.getValue("rating")} />,
    },

    // ── Actions ──────────────────────────────────────────
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => <ProductRowActions row={row} onDelete={onDelete} />,
    },
  ];
}
