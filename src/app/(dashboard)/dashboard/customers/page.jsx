"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import CustomersTable from "@/components/dashboard/customers/customers-table";

export default function CustomersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CustomersTable />
    </ProtectedRoute>
  );
}
