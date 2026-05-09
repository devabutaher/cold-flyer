/**
 * Server Actions for Authentication
 * These run on the server and can be called from client components using "use server"
 */

"use server";

import { revalidatePath } from "next/cache";
import { User, AuthResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ServerApiError extends Error {
  public status: number;
  public data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ServerApiError";
  }
}

async function serverFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new ServerApiError(
      data.message || "Auth action failed",
      response.status,
      data,
    );
  }
  return data;
}

// --- Auth Actions ---

export async function loginWithFirebaseAction(
  firebaseToken: string,
): Promise<AuthResponse> {
  try {
    const result = await serverFetch("/api/auth/firebase/login", {
      method: "POST",
      body: JSON.stringify({ firebaseToken }),
    });

    const data = result as { data?: { accessToken: string; user: User } };

    if (data.data?.accessToken) {
      // Store tokens in cookies for server-side access
      // Note: In production, use proper cookie serialization
      (globalThis as any).__COLD_FLYER_TOKEN = data.data.accessToken;
    }

    return { success: true, data: data.data };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Login failed",
      error: err.data as string,
    };
  }
}

export async function registerWithFirebaseAction(
  firebaseToken: string,
): Promise<AuthResponse> {
  try {
    const result = await serverFetch("/api/auth/firebase/register", {
      method: "POST",
      body: JSON.stringify({ firebaseToken }),
    });

    const data = result as { data?: { accessToken: string; user: User } };

    if (data.data?.accessToken) {
      (globalThis as any).__COLD_FLYER_TOKEN = data.data.accessToken;
    }

    return { success: true, data: data.data };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Registration failed",
      error: err.data as string,
    };
  }
}

export async function logoutAction(): Promise<ApiResponse<void>> {
  try {
    await serverFetch("/api/auth/logout", { method: "POST" });
    (globalThis as any).__COLD_FLYER_TOKEN = null;
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Logout failed",
    };
  }
}

export async function getCurrentUserAction(): Promise<User | null> {
  try {
    const result = await serverFetch("/api/auth/me", {
      next: { revalidate: 60 },
    });
    const data = result as { data?: User } | User;
    if ("data" in data && data.data) {
      return data.data;
    }
    return data as User;
  } catch {
    return null;
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}