"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import LocationPageComponent from "@/components/dashboard/location/location-page";

export default function LocationPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <LocationPageComponent />
    </ProtectedRoute>
  );
}
