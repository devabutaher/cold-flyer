import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const ReportingPageComponent = dynamic(() => import("@/components/dashboard/reporting/reporting-page"));

export default function ReportingPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ReportingPageComponent />
    </ProtectedRoute>
  );
}
