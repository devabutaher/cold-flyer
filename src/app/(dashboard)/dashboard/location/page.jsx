import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Location" };

const LocationPageComponent = dynamic(() => import("@/components/dashboard/location/location-page"));

export default function LocationPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <LocationPageComponent />
    </ProtectedRoute>
  );
}
