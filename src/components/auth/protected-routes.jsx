"use client";

import { useAuth } from "@/components/providers";

export default function ProtectedRoute({ children, requiredRole }) {
  const { backendUser, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
      </div>
    );

  if (!backendUser) return null;

  if (requiredRole && backendUser?.role !== requiredRole) return null;

  return children;
}
