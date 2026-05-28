import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Attendance" };

const AttendancePageComponent = dynamic(() => import("@/components/dashboard/attendance/attendance-page"));

export default function AttendancePage() {
  return (
    <ProtectedRoute requiredRole={["admin", "worker"]}>
      <AttendancePageComponent />
    </ProtectedRoute>
  );
}
