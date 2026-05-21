"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import UsersTable from "@/components/dashboard/users/users-table";

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UsersTable />
    </ProtectedRoute>
  );
}
