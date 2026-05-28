import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Activity Log" };

const ActivityLogTable = dynamic(() => import("@/components/dashboard/activity-log/activity-log-table"));

export default function ActivityLogPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ActivityLogTable />
    </ProtectedRoute>
  );
}
