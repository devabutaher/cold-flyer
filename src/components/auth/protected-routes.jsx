"use client";

import { useAuth } from "@/components/providers";
import { redirect, usePathname } from "next/navigation";

export default function ProtectedRoute({ children, requiredRole }) {
  const { backendUser, loading } = useAuth();
  const pathname = usePathname();

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
      </div>
    );

  if (!backendUser) {
    redirect(`/auth?redirect=${encodeURIComponent(pathname)}`);
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(backendUser?.role)) {
      redirect("/");
    }
  }

  return children;
}
