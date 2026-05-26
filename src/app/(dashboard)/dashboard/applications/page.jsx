import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const ApplicationsPageComponent = dynamic(() => import("@/components/dashboard/applications/applications-table"));

export default function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ApplicationsPageComponent />
    </ProtectedRoute>
  );
}
