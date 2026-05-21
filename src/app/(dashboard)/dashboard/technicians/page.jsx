"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import TechniciansTable from "@/components/dashboard/technicians/technicians-table";

export default function TechniciansPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <TechniciansTable />
    </ProtectedRoute>
  );
}
