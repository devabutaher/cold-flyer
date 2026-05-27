import { Checkbox } from "@/components/ui/checkbox";
import { AvatarCell, StatusBadge, MonoCell } from "@/components/dashboard/table/table-cells";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRowActions } from "./user-row-actions";

export function buildUserColumns({ onRoleChange, onView, onDelete } = {}) {
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
      header: "User ID",
      accessorKey: "userId",
      cell: ({ row }) => <MonoCell value={row.original.userId} />,
    },
    {
      header: "User",
      accessorKey: "name",
      cell: ({ row }) => {
        const u = row.original;
        return <AvatarCell src={u.avatar} name={u.name || u.email} sub={u.email} />;
      },
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("phone") || "—"}</span>,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        const u = row.original;
        const isTechnician = u.role === "worker";

        if (isTechnician) {
          return (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Worker
            </div>
          );
        }

        return (
          <Select value={u.role} onValueChange={(role) => onRoleChange?.(u._id, role)}>
            <SelectTrigger className="h-6 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        );
      },
      meta: { filterVariant: "select" },
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => {
        const active = row.getValue("isActive");
        return (
          <StatusBadge
            value={active ? "active" : "inactive"}
            map={{
              active: { label: "Active", className: "bg-green-500/10 text-green-600" },
              inactive: { label: "Inactive", className: "bg-destructive/10 text-destructive" },
            }}
          />
        );
      },
      meta: { filterVariant: "select" },
    },
    {
      header: "Last Login",
      accessorKey: "lastLogin",
      cell: ({ row }) => {
        const date = row.getValue("lastLogin");
        return (
          <span className="text-sm text-muted-foreground">
            {date
              ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "—"}
          </span>
        );
      },
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = row.getValue("createdAt");
        return (
          <span className="text-sm text-muted-foreground">{date ? new Date(date).toLocaleDateString() : "—"}</span>
        );
      },
    },
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => <UserRowActions user={row.original} onView={onView} onDelete={onDelete} />,
    },
  ];
}
