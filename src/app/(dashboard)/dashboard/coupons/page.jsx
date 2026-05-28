import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Coupons" };

const CouponsPageComponent = dynamic(() => import("@/components/dashboard/coupons/coupons-table"));

export default function CouponsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CouponsPageComponent />
    </ProtectedRoute>
  );
}
