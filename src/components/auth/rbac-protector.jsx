"use client";

import { useAuth } from "@/components/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole = "user" }) {
  const { backendUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!backendUser) {
      router.replace("/auth");
      return;
    }

    if (requiredRole === "admin" && backendUser?.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [backendUser, loading, router, requiredRole]);

  if (loading || !backendUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return children;
}
