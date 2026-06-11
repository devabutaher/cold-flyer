import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Workers" };

const WorkersPageComponent = dynamic(() => import("@/components/dashboard/workers/workers-table"));

export default function WorkersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Workers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage worker profiles.</p>
        </div>
        <WorkersPageComponent />
      </div>
    </ProtectedRoute>
  );
}
