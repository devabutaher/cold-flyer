/**
 * Unified API Client
 * Production-ready fetch wrapper with consistent auth, caching, and error handling
 * Use for all backend communication
 */

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith("/api")
    ? `${BASE_URL}${endpoint}`
    : `${BASE_URL}/api${endpoint}`;

  const headers = await getAuthHeader();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Convenience methods
export const apiGet = (endpoint) => apiClient(endpoint, { method: "GET" });
export const apiPost = (endpoint, body) =>
  apiClient(endpoint, { method: "POST", body: JSON.stringify(body) });
export const apiPut = (endpoint, body) =>
  apiClient(endpoint, { method: "PUT", body: JSON.stringify(body) });
export const apiPatch = (endpoint, body) =>
  apiClient(endpoint, { method: "PATCH", body: JSON.stringify(body) });
export const apiDelete = (endpoint) =>
  apiClient(endpoint, { method: "DELETE" });

// Server-side user fetching
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return null;
    }

    const data = await apiGet("/auth/me");
    return data?.data?.user || null;
  } catch {
    return null;
  }
}

export default {
  apiClient,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  getCurrentUser,
  BASE_URL,
};
