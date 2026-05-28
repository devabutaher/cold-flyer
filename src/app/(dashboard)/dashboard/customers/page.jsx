import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Customers" };

const CustomersPageComponent = dynamic(() => import("@/components/dashboard/customers/customers-table"));

export default function CustomersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CustomersPageComponent />
    </ProtectedRoute>
  );
}
