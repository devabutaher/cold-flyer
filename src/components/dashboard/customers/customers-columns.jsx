import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarCell, StatusBadge, PriceCell, MonoCell } from "@/components/dashboard/table/table-cells";
import { Edit, Eye, MoreHorizontal, ToggleLeft, Trash2 } from "lucide-react";

export const CUSTOMER_STATUS_MAP = {
  active: { label: "Active", className: "bg-green-500/10 text-green-600" },
  blocked: { label: "Blocked", className: "bg-red-500/10 text-red-600" },
};

export function buildCustomerColumns({ onEdit, onDelete, onToggleStatus, onInvoice } = {}) {
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
      header: "Customer ID",
      accessorKey: "customerId",
      id: "customerId",
      cell: ({ row }) => <MonoCell value={row.original.customerId} />,
    },
    {
      header: "Name",
      accessorKey: "name",
      id: "name",
      cell: ({ row }) => {
        const c = row.original;
        return <AvatarCell name={c.name} sub={c.phone || c.email} />;
      },
    },
    {
      header: "Brand / Model",
      id: "brandModel",
      cell: ({ row }) => {
        const c = row.original;
        const brand = c.brand || "—";
        const model = c.model || "—";
        return (
          <div className="text-sm">
            <span className="font-medium">{brand}</span>
            {model !== "—" && <span className="text-muted-foreground ml-1">/ {model}</span>}
          </div>
        );
      },
    },
    {
      header: "Unit",
      accessorKey: "unit",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("unit") || "—"}</span>,
    },
    {
      header: "Ton",
      accessorKey: "acTon",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("acTon") || "—"}</span>,
    },
    {
      header: "Gas Type",
      accessorKey: "gasType",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("gasType") || "—"}</span>,
    },
    {
      header: "Bookings",
      accessorKey: "bookingCount",
      cell: ({ row }) => <span className="text-sm font-mono">{row.getValue("bookingCount") ?? 0}</span>,
    },
    {
      header: "Service",
      accessorKey: "service",
      cell: ({ row }) => <span className="text-sm capitalize">{row.getValue("service") || "—"}</span>,
    },
    {
      header: "Install Date",
      accessorKey: "installDate",
      cell: ({ row }) => {
        const date = row.getValue("installDate");
        return (
          <span className="text-sm text-muted-foreground">{date ? new Date(date).toLocaleDateString() : "—"}</span>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => <PriceCell price={row.getValue("amount") || 0} />,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge value={row.getValue("status")} map={CUSTOMER_STATUS_MAP} />,
      meta: { filterVariant: "select" },
    },
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal size={15} />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onEdit?.(c)}>
                  <Edit size={14} className="mr-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus?.(c._id)}>
                  <ToggleLeft size={14} className="mr-3" />
                  {c.status === "active" ? "Block" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInvoice?.(c)}>
                  <Eye size={14} className="mr-3" />
                  Invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete?.(c._id)}>
                  <Trash2 size={14} className="mr-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
