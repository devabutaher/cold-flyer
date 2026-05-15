"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const user = data?.data?.user || null;
        setBackendUser(user);
        return user;
      }
      setBackendUser(null);
      return null;
    } catch {
      setBackendUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    refreshUser().then(() => {
      if (mounted) setLoading(false);
    });

    return () => { mounted = false; };
  }, [refreshUser]);

  const logOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Proceed even if backend call fails
    }
    setBackendUser(null);
    router.push("/");
  }, [router]);

  const value = {
    backendUser,
    loading,
    logOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
