"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import CouponsTable from "@/components/dashboard/coupons/coupons-table";

export default function CouponsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CouponsTable />
    </ProtectedRoute>
  );
}
