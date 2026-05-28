import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Services" };

const ServicesTable = dynamic(() => import("@/components/dashboard/service/services-table/services-table"));

export default function ServicesPage() {
  return (
    <ProtectedRoute requiredRole={["admin", "moderator"]}>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">All Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your AC services and maintenance offerings.</p>
        </div>
        <ServicesTable isAdmin={true} />
      </div>
    </ProtectedRoute>
  );
}
