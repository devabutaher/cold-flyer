"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import ExpensesTable from "@/components/dashboard/expenses/expenses-table";

export default function ExpensesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ExpensesTable />
    </ProtectedRoute>
  );
}
