"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { attemptTokenRefresh } from "@/lib/refresh-mutex";

const AuthContext = createContext(null);

async function fetchWithRefresh(url, options = {}) {
  let res = await fetch(url, { credentials: "include", ...options });
  if (res.ok || options.skipRefresh) return res;

  const refreshed = await attemptTokenRefresh();
  if (!refreshed) return res;

  return fetch(url, { credentials: "include", ...options });
}

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
        if (data?.data?.authenticated) {
          setBackendUser(data.data.user);
        } else {
          setBackendUser(null);
        }
      })
      .catch(() => {
        setBackendUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    const heartbeat = setInterval(() => {
      attemptTokenRefresh();
    }, 45 * 60 * 1000);

    return () => clearInterval(heartbeat);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetchWithRefresh("/api/auth/me");
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

  const logOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    await fetch("/api/auth/signout", { credentials: "include" }).catch(() => {});
    setBackendUser(null);
    router.push("/");
  }, [router]);

  const value = useMemo(() => ({
    backendUser,
    loading,
    logOut,
    refreshUser,
  }), [backendUser, loading, logOut, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
