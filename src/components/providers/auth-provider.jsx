"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetch("/api/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.authenticated) setBackendUser(data.data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const user = data?.data?.user || null;
        setBackendUser(user);
        return user;
      }
      return null;
    } catch {
      setBackendUser(null);
      return null;
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setBackendUser(null);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({
      backendUser,
      loading,
      logOut,
      refreshUser,
    }),
    [backendUser, loading, logOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
