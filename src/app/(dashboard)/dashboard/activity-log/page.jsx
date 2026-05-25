"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import ActivityLogTable from "@/components/dashboard/activity-log/activity-log-table";

export default function ActivityLogPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ActivityLogTable />
    </ProtectedRoute>
  );
}
