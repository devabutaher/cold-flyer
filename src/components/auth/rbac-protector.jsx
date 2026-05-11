"use client";

import { useAuth } from "@/components/providers";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ROLE_ROUTES = {
  admin: ["/dashboard"],
  user: ["/dashboard", "/profile", "/orders"],
};

export function checkRoleAccess(userRole, path) {
  if (!userRole) return false;
  
  if (userRole === "admin") return true;
  
  const userRoutes = ROLE_ROUTES[userRole] || [];
  return userRoutes.some(route => path.startsWith(route));
}

export default function ProtectedRoute({ children, requiredRole = "user" }) {
  const { backendUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    
    if (!backendUser) {
      router.replace("/auth");
      return;
    }

    // Role-based access control
    if (requiredRole === "admin" && backendUser?.role !== "admin") {
      router.replace("/");
      return;
    }

    if (requiredRole === "user" && !["admin", "user"].includes(backendUser?.role)) {
      router.replace("/auth");
    }
  }, [backendUser, loading, router, pathname, requiredRole]);

  if (loading || !backendUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return children;
}