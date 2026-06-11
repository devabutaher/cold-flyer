import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Activity Log" };

const ActivityLogTable = dynamic(() => import("@/components/dashboard/activity-log/activity-log-table"));

export default function ActivityLogPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track all system activities and user actions.</p>
        </div>
        <ActivityLogTable />
      </div>
    </ProtectedRoute>
  );
}
