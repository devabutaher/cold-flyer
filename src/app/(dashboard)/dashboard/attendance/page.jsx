"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import AttendancePageComponent from "@/components/dashboard/attendance/attendance-page";

export default function AttendancePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AttendancePageComponent />
    </ProtectedRoute>
  );
}
