import { AvatarCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { ApplicationRowActions } from "./application-row-actions";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  approved: { label: "Approved", className: "bg-green-500/10 text-green-600" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

export function buildApplicationColumns({ onView, onApprove, onReject, onDelete } = {}) {
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
      header: "Applicant",
      accessorKey: "name",
      id: "name",
      cell: ({ row }) => {
        const a = row.original;
        return <AvatarCell src={null} name={a.name || "N/A"} sub={a.email} />;
      },
    },
    {
      header: "Position",
      accessorKey: "position",
      id: "position",
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.position || "—"}</span>,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      id: "phone",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone || "—"}</span>,
    },
    {
      header: "Date Applied",
      accessorKey: "createdAt",
      id: "createdAt",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      id: "status",
      cell: ({ row }) => <StatusBadge value={row.getValue("status")} map={STATUS_MAP} />,
      meta: { filterVariant: "select" },
    },
    {
      id: "actions",
      size: 130,
      enableSorting: false,
      header: "",
      cell: ({ row }) => (
        <ApplicationRowActions
          application={row.original}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
