import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const AttendancePageComponent = dynamic(() => import("@/components/dashboard/attendance/attendance-page"));

export default function AttendancePage() {
  return (
    <ProtectedRoute requiredRole={["admin", "worker"]}>
      <AttendancePageComponent />
    </ProtectedRoute>
  );
}
