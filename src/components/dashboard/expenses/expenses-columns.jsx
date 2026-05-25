import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge, PriceCell } from "@/components/dashboard/table/table-cells";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

export const EXPENSE_CATEGORY_MAP = {
  utilities: { label: "Utilities", className: "bg-blue-500/10 text-blue-600" },
  salary: { label: "Salary", className: "bg-purple-500/10 text-purple-600" },
  rent: { label: "Rent", className: "bg-orange-500/10 text-orange-600" },
  maintenance: { label: "Maintenance", className: "bg-yellow-500/10 text-yellow-600" },
  transport: { label: "Transport", className: "bg-cyan-500/10 text-cyan-600" },
  office_supplies: { label: "Office Supplies", className: "bg-pink-500/10 text-pink-600" },
  marketing: { label: "Marketing", className: "bg-indigo-500/10 text-indigo-600" },
  food: { label: "Food", className: "bg-green-500/10 text-green-600" },
  other: { label: "Other", className: "bg-muted text-muted-foreground" },
};

export function buildExpenseColumns({ onEdit, onDelete } = {}) {
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
      header: "Date",
      accessorKey: "date",
      id: "date",
      cell: ({ row }) => {
        const date = row.original.date;
        return (
          <span className="text-sm text-muted-foreground">
            {date ? new Date(date).toLocaleDateString() : "—"}
          </span>
        );
      },
    },
    {
      header: "Item",
      accessorKey: "item",
      id: "item",
      cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("item") || "—"}</span>,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => <StatusBadge value={row.getValue("category")} map={EXPENSE_CATEGORY_MAP} />,
      meta: { filterVariant: "select" },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => <PriceCell price={row.getValue("amount") || 0} />,
    },
    {
      header: "Added By",
      id: "addedBy",
      cell: ({ row }) => {
        const e = row.original;
        const name = e.addedBy?.name || e.addedBy || "—";
        return <span className="text-sm text-muted-foreground">{name}</span>;
      },
    },
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => {
        const e = row.original;
        return (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal size={15} />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(e)}>
                  <Edit size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete?.(e._id)}>
                  <Trash2 size={14} className="mr-2 text-destructive" />
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
