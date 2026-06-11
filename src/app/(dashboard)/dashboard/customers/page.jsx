import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Customers" };

const CustomersPageComponent = dynamic(() => import("@/components/dashboard/customers/customers-table"));

export default function CustomersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View and manage customer information.</p>
        </div>
        <CustomersPageComponent />
      </div>
    </ProtectedRoute>
  );
}
