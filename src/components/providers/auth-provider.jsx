"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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

    fetchWithRefresh("/api/auth/me", { skipRefresh: true })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setBackendUser(data?.data?.user || null);
      })
      .catch(() => {
        setBackendUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
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
    } catch {
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
