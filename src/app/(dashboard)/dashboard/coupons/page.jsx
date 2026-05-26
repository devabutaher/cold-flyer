import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const CouponsPageComponent = dynamic(() => import("@/components/dashboard/coupons/coupons-table"));

export default function CouponsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CouponsPageComponent />
    </ProtectedRoute>
  );
}
