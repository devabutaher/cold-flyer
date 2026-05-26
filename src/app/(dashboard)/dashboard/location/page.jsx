import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const LocationPageComponent = dynamic(() => import("@/components/dashboard/location/location-page"));

export default function LocationPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <LocationPageComponent />
    </ProtectedRoute>
  );
}
