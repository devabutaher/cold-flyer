import { Checkbox } from "@/components/ui/checkbox";
import { AvatarCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ROLE_MAP = {
  admin: { label: "Admin", className: "bg-primary/10 text-primary" },
  user: { label: "User", className: "bg-muted text-muted-foreground" },
};

export function buildUserColumns({ onRoleChange } = {}) {
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
        return (
          <div className="flex items-center gap-2">
            <StatusBadge value={u.role} map={ROLE_MAP} />
            <Select value={u.role} onValueChange={(role) => onRoleChange?.(u._id, role)}>
              <SelectTrigger className="h-7 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
      meta: { filterVariant: "select" },
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
  ];
}
