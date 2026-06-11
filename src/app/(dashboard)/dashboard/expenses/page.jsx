import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Expenses" };

const ExpensesPageComponent = dynamic(() => import("@/components/dashboard/expenses/expenses-table"));

export default function ExpensesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage business expenses.</p>
        </div>
        <ExpensesPageComponent />
      </div>
    </ProtectedRoute>
  );
}
