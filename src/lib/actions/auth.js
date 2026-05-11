/**
 * Server Actions for Authentication
 * These run on the server and can be called from client components
 */

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

class ServerApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ServerApiError";
  }
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function serverFetch(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith("/api")
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}/api${endpoint}`;

  const authHeaders = await getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new ServerApiError(
      data.message || "Server action failed",
      response.status,
      data,
    );
  }
  return data;
}

export async function loginWithFirebaseAction(firebaseToken) {
  try {
    const result = await serverFetch("/api/auth/firebase/login", {
      method: "POST",
      body: JSON.stringify({ firebaseToken }),
    });

    return { success: true, data: result?.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Login failed",
      error: error.data,
    };
  }
}

export async function registerWithFirebaseAction(firebaseToken, phone = "") {
  try {
    const result = await serverFetch("/api/auth/firebase/register", {
      method: "POST",
      body: JSON.stringify({ firebaseToken, phone }),
    });

    return { success: true, data: result?.data };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Registration failed",
      error: error.data,
    };
  }
}

export async function logoutAction() {
  try {
    await serverFetch("/api/auth/logout", { method: "POST" });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Logout failed",
    };
  }
}

export async function getCurrentUserAction() {
  try {
    const result = await serverFetch("/api/auth/me");
    if (result?.data) return result.data;
    return result;
  } catch {
    return null;
  }
}
