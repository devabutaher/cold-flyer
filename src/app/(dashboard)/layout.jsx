import ProtectedRoute from "@/components/auth/protected-routes";
import { AppShell } from "@/components/dashboard/layout/app-shell";

export const metadata = { title: { default: "Dashboard" } };

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
