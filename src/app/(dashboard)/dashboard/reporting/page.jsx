"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import ReportingPageComponent from "@/components/dashboard/reporting/reporting-page";

export default function ReportingPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ReportingPageComponent />
    </ProtectedRoute>
  );
}
