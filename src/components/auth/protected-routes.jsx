"use client";

import { useAuth } from "@/components/providers";
import { motion } from "framer-motion";
import { RefreshCw, WifiOff, Home } from "lucide-react";
import Link from "next/link";

export default function ProtectedRoute({ children, requiredRole }) {
  const { backendUser, loading } = useAuth();

  if (loading || !backendUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-[3px] border-muted" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
            <WifiOff className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-heading text-lg font-semibold text-foreground">Connection Lost</h2>
            <p className="max-w-65 text-sm text-muted-foreground leading-relaxed">
              Having trouble reaching the server. Your session is still active.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.97]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.97]"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (requiredRole && backendUser?.role !== requiredRole) return null;

  return children;
}
