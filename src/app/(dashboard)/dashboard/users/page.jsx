import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Users" };

const UsersTable = dynamic(() => import("@/components/dashboard/users/users-table"));

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage system users and their roles.</p>
        </div>
        <UsersTable />
      </div>
    </ProtectedRoute>
  );
}
