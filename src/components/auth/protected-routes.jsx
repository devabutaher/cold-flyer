"use client";

import { useAuth } from "@/components/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole }) {
  const { backendUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!backendUser) {
      router.replace(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (requiredRole && backendUser?.role !== requiredRole) {
      router.replace("/");
    }
  }, [backendUser, loading, router, requiredRole]);

  if (loading || !backendUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (requiredRole && backendUser?.role !== requiredRole) return null;

  return children;
}
