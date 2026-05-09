/**
 * API Client - Centralized fetch utility for client-side API calls
 * Used by TanStack Query hooks and client components
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function handleResponse(response: Response): Promise<unknown> {
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      response.status,
      data,
    );
  }
  return data;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> {
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
}

export async function apiGet(endpoint: string): Promise<unknown> {
  return apiClient(endpoint, { method: "GET" });
}

export async function apiPost(endpoint: string, body: unknown): Promise<unknown> {
  return apiClient(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPut(endpoint: string, body: unknown): Promise<unknown> {
  return apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiPatch(endpoint: string, body: unknown): Promise<unknown> {
  return apiClient(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(endpoint: string): Promise<unknown> {
  return apiClient(endpoint, { method: "DELETE" });
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function getUser(): unknown {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}