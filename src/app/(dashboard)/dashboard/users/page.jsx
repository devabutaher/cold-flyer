import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const UsersTable = dynamic(() => import("@/components/dashboard/users/users-table"));

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UsersTable />
    </ProtectedRoute>
  );
}
