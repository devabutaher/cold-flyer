import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Technicians" };

const TechniciansPageComponent = dynamic(() => import("@/components/dashboard/technicians/technicians-table"));

export default function TechniciansPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Workers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage technician and worker profiles.</p>
        </div>
        <TechniciansPageComponent />
      </div>
    </ProtectedRoute>
  );
}
