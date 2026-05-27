"use client";

import { useMemo, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { Button } from "@/components/ui/button";
import { AddUserSheet } from "./add-user-sheet";
import { buildUserColumns } from "./users-columns";
import { getClient } from "@/lib/http-client";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const mapRow = (u) => ({
  name: u.name || u.email,
  userId: u.userId,
  email: u.email,
  phone: u.phone || "—",
  role: u.role,
  isActive: u.isActive,
  lastLogin: u.lastLogin,
  joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
});

const PDF_COLUMNS = [
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "User ID", accessorKey: "userId", width: 1.2 },
  { header: "Email", accessorKey: "email", width: 2.5 },
  { header: "Phone", accessorKey: "phone", width: 1.5 },
  { header: "Role", accessorKey: "role", width: 0.8 },
  { header: "Status", accessorKey: "isActive", width: 0.8 },
  { header: "Last Login", accessorKey: "lastLogin", width: 1.2 },
  { header: "Joined", accessorKey: "joined", width: 1.2 },
];

export default function UsersTable() {
  const [addSheetOpen, setAddSheetOpen] = useState(false);
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

  const deleteMutation = useMutation({
    mutationFn: (id) => getClient().delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted.");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const router = useRouter();

  const handleView = useCallback(
    (user) => {
      router.push(`/dashboard/users/${user._id}`);
    },
    [router],
  );

  const handleRoleChange = useCallback((id, role) => updateRole.mutate({ id, role }), [updateRole]);
  const handleDelete = useCallback((id) => deleteMutation.mutate(id), [deleteMutation]);

  const columns = useMemo(
    () => buildUserColumns({ onRoleChange: handleRoleChange, onView: handleView, onDelete: handleDelete }),
    [handleRoleChange, handleView, handleDelete],
  );

  const roleOptions = ["user", "admin", "technician"];

  return (
    <>
    <DataTable
      columns={columns}
      data={users}
      loading={isLoading}
      rowCount="users"
      defaultSort={[]}
      emptyMessage="No users found."
      emptyIcon={<Users size={40} />}
      searchFields={["userId", "name", "email", "phone", "role"]}
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
            {
              columnId: "isActive",
              placeholder: "All Statuses",
              allLabel: "All Statuses",
              options: ["true", "false"],
            },
          ]}
          actions={
            <>
              <Button onClick={() => setAddSheetOpen(true)}>
                <Plus className="mr-1 size-4" />
                Add User
              </Button>
              <ExportMenu
                table={table}
                filename="users"
                mapRow={mapRow}
                pdfTitle="ColdFlyer — Users Report"
                pdfColumns={PDF_COLUMNS}
              />
            </>
          }
        />
      )}
    />
    <AddUserSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />
  </>
  );
}
