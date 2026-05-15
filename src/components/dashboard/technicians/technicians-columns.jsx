import { Checkbox } from "@/components/ui/checkbox";
import { AvatarCell, StatusBadge, RatingCell } from "@/components/dashboard/table/table-cells";

const STATUS_MAP = {
  available: { label: "Available", className: "bg-green-500/10 text-green-600" },
  busy: { label: "Busy", className: "bg-amber-500/10 text-amber-600" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground" },
  on_leave: { label: "On Leave", className: "bg-destructive/10 text-destructive" },
};

export function buildTechnicianColumns({ onDelete } = {}) {
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
      header: "Name",
      accessorKey: "user.name",
      id: "name",
      cell: ({ row }) => {
        const t = row.original;
        return <AvatarCell src={t.user?.avatar} name={t.user?.name || "N/A"} sub={t.employeeId} />;
      },
    },
    {
      header: "Email",
      accessorKey: "user.email",
      id: "email",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.user?.email || "—"}</span>,
    },
    {
      header: "Specialization",
      accessorKey: "specializations",
      cell: ({ row }) => {
        const specs = row.original.specializations || [];
        return <span className="text-sm capitalize">{(specs.length ? specs.join(", ") : "—")}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge value={row.getValue("status")} map={STATUS_MAP} />,
      meta: { filterVariant: "select" },
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: ({ row }) => <RatingCell rating={row.getValue("rating")} />,
    },
    {
      header: "Jobs Done",
      accessorKey: "completedJobs",
      cell: ({ row }) => <span className="text-sm font-medium tabular-nums">{row.original.completedJobs || 0}</span>,
    },
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="flex justify-end">
            <button
              className="text-xs text-destructive hover:underline"
              onClick={(e) => { e.stopPropagation(); onDelete?.(t._id); }}
            >
              Remove
            </button>
          </div>
        );
      },
    },
  ];
}
