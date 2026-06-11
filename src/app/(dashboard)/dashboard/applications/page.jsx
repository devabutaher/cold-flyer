import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Applications" };

const ApplicationsPageComponent = dynamic(() => import("@/components/dashboard/applications/applications-table"));

export default function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Applications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review job applications and approve or reject them.</p>
        </div>
        <ApplicationsPageComponent />
      </div>
    </ProtectedRoute>
  );
}
