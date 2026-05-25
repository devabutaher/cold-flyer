"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import MessagesPageComponent from "@/components/dashboard/messages/messages-page";

export default function MessagesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <MessagesPageComponent />
    </ProtectedRoute>
  );
}
