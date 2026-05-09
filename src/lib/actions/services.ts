/**
 * Server Actions for Service CRUD operations
 */

"use server";

import { revalidateTag } from "next/cache";
import { Service, ApiResponse } from "@/types";

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
  const token = (globalThis as any).__COLD_FLYER_TOKEN || null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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

export async function getServicesServer(
  params?: Record<string, string>,
): Promise<Service[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.serviceType) query.set("serviceType", params.serviceType);
  if (params?.sort) {
    const sortMap: Record<string, string> = {
      "Price: Low to High": "price_asc",
      "Price: High to Low": "price_desc",
      Rating: "rating",
      Popular: "popular",
    };
    query.set("sortBy", sortMap[params.sort] || "rating");
  }
  if (params?.featured) query.set("featured", "true");

  const endpoint = query.toString()
    ? `/api/services?${query}`
    : "/api/services";

  try {
    const result = await serverFetch(endpoint, {
      next: { tags: ["services"] },
    });
    const data = result as { data?: { services: Service[] } } | Service[];
    if ("data" in data && data.data?.services) {
      return data.data.services;
    }
    return data as Service[];
  } catch {
    return [];
  }
}

export async function getServiceBySlugServer(
  slug: string,
): Promise<Service | null> {
  try {
    const result = await serverFetch(`/api/services/slug/${slug}`, {
      next: { tags: [`service:${slug}`] },
    });
    const data = result as { data?: { service: Service } } | Service;
    if ("data" in data && data.data?.service) {
      return data.data.service;
    }
    return data as Service;
  } catch {
    return null;
  }
}

export async function getFeaturedServicesServer(): Promise<Service[]> {
  try {
    const result = await serverFetch("/api/services/featured");
    const data = result as { data?: { services: Service[] } } | Service[];
    if ("data" in data && data.data?.services) {
      return data.data.services;
    }
    return data as Service[];
  } catch {
    return [];
  }
}

export async function createServiceAction(
  serviceData: Partial<Service> & {
    name: string;
    category: string;
    serviceType: string;
    basePrice: number;
  },
): Promise<ApiResponse<Service>> {
  try {
    const result = await serverFetch("/api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
    revalidateTag("services");
    return { success: true, data: result as Service };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to create service",
      error: err.data as string,
    };
  }
}

export async function updateServiceAction(
  id: string,
  serviceData: Partial<Service>,
): Promise<ApiResponse<Service>> {
  try {
    const result = await serverFetch(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(serviceData),
    });
    revalidateTag("services");
    return { success: true, data: result as Service };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to update service",
      error: err.data as string,
    };
  }
}

export async function deleteServiceAction(
  id: string,
): Promise<ApiResponse<void>> {
  try {
    await serverFetch(`/api/services/${id}`, { method: "DELETE" });
    revalidateTag("services");
    return { success: true };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to delete service",
    };
  }
}