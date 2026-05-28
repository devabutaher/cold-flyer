import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Messages" };

const MessagesPageComponent = dynamic(() => import("@/components/dashboard/messages/messages-page"));

export default function MessagesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <MessagesPageComponent />
    </ProtectedRoute>
  );
}
