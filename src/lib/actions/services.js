"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient, API_BACKEND_URL, getServerFetchHeaders } from "@/lib/http-client";
import { requireRole } from "@/lib/auth-server";

export async function getServicesServer(params) {
  try {
    const cookieStore = await cookies();
    const query = new URLSearchParams();
    if (params?.q) query.set("search", params.q);
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
    const qs = query.toString();
    const res = await fetch(`${API_BACKEND_URL}/api/services${qs ? `?${qs}` : ""}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["services"] },
    });
    const data = await res.json();
    return data;
  } catch {
    return { data: { services: [] }, success: false };
  }
}

export async function getServiceByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/services/${id}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["services"] },
    });
    const data = await res.json();
    return data?.data?.service || data;
  } catch {
    return null;
  }
}

export async function getServiceBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/services/slug/${slug}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["services"] },
    });
    const data = await res.json();
    return data?.data?.service || data;
  } catch {
    return null;
  }
}

export async function getFeaturedServicesServer() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/services/featured`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["services"] },
    });
    const data = await res.json();
    return data?.data?.services || data;
  } catch {
    return [];
  }
}

export async function createServiceAction(serviceData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/services", serviceData);
    revalidateTag("services");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create service",
      error: error.response?.data,
    };
  }
}

export async function updateServiceAction(id, serviceData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/services/${id}`, serviceData);
    revalidateTag("services");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update service",
      error: error.response?.data,
    };
  }
}

export async function deleteServiceAction(id) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/services/${id}`);
    revalidateTag("services");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete service",
    };
  }
}

export async function createBookingAction(bookingData) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/services/bookings", bookingData);
    revalidateTag("bookings");
    return { success: true, data: res.data };
  } catch (error) {
    const fieldErrors = error.response?.data?.errors?.map((e) => `${e.field}: ${e.message}`).join("; ");
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create booking",
      ...(fieldErrors && { details: fieldErrors }),
    };
  }
}

export async function getBookingsServer() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/services/bookings`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["bookings"] },
    });
    const data = await res.json();
    return data?.data?.bookings || data;
  } catch {
    return [];
  }
}

export async function getBookingByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/services/bookings/${id}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["bookings"] },
    });
    const data = await res.json();
    return data?.data?.booking || data;
  } catch {
    return null;
  }
}

export async function cancelBookingAction(bookingId, reason) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.patch(`/api/services/bookings/${bookingId}/cancel`, { reason });
    revalidateTag("bookings");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to cancel booking",
    };
  }
}

export async function updateBookingAction(bookingId, bookingData) {
  try {
    await requireRole("admin", "moderator", "worker");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/services/bookings/${bookingId}`, bookingData);
    revalidateTag("bookings");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update booking",
    };
  }
}
