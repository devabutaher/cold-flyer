import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const ExpensesPageComponent = dynamic(() => import("@/components/dashboard/expenses/expenses-table"));

export default function ExpensesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ExpensesPageComponent />
    </ProtectedRoute>
  );
}
