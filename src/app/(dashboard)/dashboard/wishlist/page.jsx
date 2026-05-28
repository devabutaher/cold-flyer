import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

export const metadata = { title: "Wishlist" };

const WishlistPageComponent = dynamic(() => import("@/components/dashboard/wishlist/wishlist-page"));

export default function WishlistPage() {
  return (
    <ProtectedRoute requiredRole={["admin", "moderator", "worker", "customer"]}>
      <WishlistPageComponent />
    </ProtectedRoute>
  );
}
