import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Technicians" };

const TechniciansPageComponent = dynamic(() => import("@/components/dashboard/technicians/technicians-table"));

export default function TechniciansPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <TechniciansPageComponent />
    </ProtectedRoute>
  );
}
