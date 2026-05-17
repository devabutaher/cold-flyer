"use client";

import { useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { buildUserColumns } from "./users-columns";
import { getClient } from "@/lib/http-client";
import { Users } from "lucide-react";
import { toast } from "sonner";

const mapRow = (u) => ({
  name: u.name || u.email,
  email: u.email,
  phone: u.phone || "—",
  role: u.role,
  joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
});

const PDF_COLUMNS = [
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "Email", accessorKey: "email", width: 2.5 },
  { header: "Phone", accessorKey: "phone", width: 1.5 },
  { header: "Role", accessorKey: "role", width: 0.8 },
  { header: "Joined", accessorKey: "joined", width: 1.2 },
];

export default function UsersTable() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await getClient().get("/admin/users");
      return res.data?.data?.users || [];
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => getClient().patch(`/admin/users/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleRoleChange = useCallback((id, role) => updateRole.mutate({ id, role }), [updateRole]);

  const columns = useMemo(() => buildUserColumns({ onRoleChange: handleRoleChange }), [handleRoleChange]);

  const roleOptions = ["user", "admin"];

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={isLoading}
      rowCount="users"
      defaultSort={[{ id: "name", desc: false }]}
      emptyMessage="No users found."
      emptyIcon={<Users size={40} />}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search users..."
          selectedLabel="users"
          filters={[
            {
              columnId: "role",
              placeholder: "All Roles",
              allLabel: "All Roles",
              options: roleOptions,
            },
          ]}
          actions={
            <ExportMenu
              table={table}
              filename="users"
              mapRow={mapRow}
              pdfTitle="ColdFlyer — Users Report"
              pdfColumns={PDF_COLUMNS}
            />
          }
        />
      )}
    />
  );
}
