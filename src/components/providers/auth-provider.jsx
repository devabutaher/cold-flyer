"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

function decodeJwtPayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function getAccessToken() {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const initialized = useRef(false);
  const expiryTimer = useRef(null);

  const performLogout = useCallback(
    (redirectPath) => {
      fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
      setBackendUser(null);
      const path = redirectPath || window.location.pathname;
      if (!path.startsWith("/auth")) {
        router.push(`/auth?redirect=${encodeURIComponent(path)}`);
      }
    },
    [router],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetch("/api/auth/status", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.authenticated) {
          setBackendUser(data.data.user);
        } else if (getAccessToken()) {
          return fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
        }
      })
      .catch((err) => console.error("[AuthProvider] Status fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!backendUser) return;

    function checkExpiry() {
      const token = getAccessToken();
      if (!token) return;
      const payload = decodeJwtPayload(token);
      if (!payload?.exp) return;

      const msUntilExpiry = payload.exp * 1000 - Date.now();
      if (msUntilExpiry <= 60000) {
        performLogout(window.location.pathname);
      }
    }

    checkExpiry();
    expiryTimer.current = setInterval(checkExpiry, 30000);

    return () => {
      if (expiryTimer.current) clearInterval(expiryTimer.current);
    };
  }, [backendUser, performLogout]);

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
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setBackendUser(null);
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({ backendUser, loading, logOut, refreshUser }),
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
