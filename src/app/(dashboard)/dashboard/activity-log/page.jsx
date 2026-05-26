import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const ActivityLogTable = dynamic(() => import("@/components/dashboard/activity-log/activity-log-table"));

export default function ActivityLogPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ActivityLogTable />
    </ProtectedRoute>
  );
}
