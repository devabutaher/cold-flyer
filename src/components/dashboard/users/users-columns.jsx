import { Checkbox } from "@/components/ui/checkbox";
import { AvatarCell, StatusBadge } from "@/components/dashboard/table/table-cells";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRowActions } from "./user-row-actions";


const ROLE_MAP = {
  admin: { label: "Admin", className: "bg-primary/10 text-primary" },
  user: { label: "User", className: "bg-muted text-muted-foreground" },
};

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
        const isTechnician = u.role === "technician";
        return (
          <div className="flex items-center gap-2">
            <Select 
              value={u.role} 
              onValueChange={(role) => onRoleChange?.(u._id, role)}
              disabled={isTechnician}
            >
              <SelectTrigger className="h-6 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {isTechnician && (
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xxs font-medium text-primary">
                Technician
              </div>
            )}
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
    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => (
        <UserRowActions
          user={row.original}
          onView={onView}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
