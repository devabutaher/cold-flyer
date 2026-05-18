"use client";

import { useAuth } from "@/components/providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { backendUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !backendUser) {
      router.replace(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [backendUser, loading, router]);

  if (loading || !backendUser) return null;

  return children;
}
