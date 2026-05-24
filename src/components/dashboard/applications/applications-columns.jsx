import { AvatarCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Eye, XCircle } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  approved: { label: "Approved", className: "bg-green-500/10 text-green-600" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

export function buildApplicationColumns({ onView, onApprove, onReject } = {}) {
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
      size: 160,
      enableSorting: false,
      header: "",
      cell: ({ row }) => {
        const a = row.original;
        const isPending = a.status === "pending";
        return (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView?.(a)} title="View Details">
              <Eye className="h-4 w-4" />
            </Button>
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700"
                  onClick={() => onApprove?.(a)}
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onReject?.(a)}
                  title="Reject"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}
