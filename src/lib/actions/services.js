/**
 * Server Actions for Service CRUD operations
 */

"use server";

import { revalidateTag } from "next/cache";
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

export async function getServicesServer(params) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.serviceType) query.set("serviceType", params.serviceType);
  if (params?.sort) {
    const sortMap = {
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
    const result = await serverFetch(endpoint);
    return result;
  } catch {
    return { data: { services: [] }, success: false };
  }
}

export async function getServiceByIdServer(id) {
  try {
    const result = await serverFetch(`/api/services/${id}`);
    if (result?.data?.service) return result.data.service;
    return result;
  } catch {
    return null;
  }
}

export async function getServiceBySlugServer(slug) {
  try {
    const result = await serverFetch(`/api/services/slug/${slug}`);
    if (result?.data?.service) return result.data.service;
    return result;
  } catch {
    return null;
  }
}

export async function getFeaturedServicesServer() {
  try {
    const result = await serverFetch("/api/services/featured");
    if (result?.data?.services) return result.data.services;
    return result;
  } catch {
    return [];
  }
}

export async function createServiceAction(serviceData) {
  try {
    const result = await serverFetch("/api/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
    revalidateTag("services");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create service",
      error: error.data,
    };
  }
}

export async function updateServiceAction(id, serviceData) {
  try {
    const result = await serverFetch(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(serviceData),
    });
    revalidateTag("services");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update service",
      error: error.data,
    };
  }
}

export async function deleteServiceAction(id) {
  try {
    await serverFetch(`/api/services/${id}`, { method: "DELETE" });
    revalidateTag("services");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to delete service",
    };
  }
}

// --- Booking Actions ---

export async function createBookingAction(bookingData) {
  try {
    const result = await serverFetch("/api/services/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
    return { success: true, data: result };
  } catch (error) {
    const fieldErrors = error.data?.errors?.map(e => `${e.field}: ${e.message}`).join("; ");
    return {
      success: false,
      message: error.message || "Failed to create booking",
      ...(fieldErrors && { details: fieldErrors }),
    };
  }
}

export async function getBookingsServer() {
  try {
    const result = await serverFetch("/api/services/bookings");
    if (result?.data?.bookings) return result.data.bookings;
    return result;
  } catch {
    return [];
  }
}

export async function getBookingByIdServer(id) {
  try {
    const result = await serverFetch(`/api/services/bookings/${id}`);
    if (result?.data?.booking) return result.data.booking;
    return result;
  } catch {
    return null;
  }
}

export async function cancelBookingAction(bookingId, reason) {
  try {
    await serverFetch(`/api/services/bookings/${bookingId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to cancel booking",
    };
  }
}

export async function updateBookingAction(bookingId, bookingData) {
  try {
    const result = await serverFetch(`/api/services/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify(bookingData),
    });
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update booking",
    };
  }
}
