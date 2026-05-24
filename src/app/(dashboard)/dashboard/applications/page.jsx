"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import ApplicationsTable from "@/components/dashboard/applications/applications-table";

export default function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage technician job applications</p>
        </div>
        <ApplicationsTable />
      </div>
    </ProtectedRoute>
  );
}
