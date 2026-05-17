"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/http-client";

export async function getServicesServer(params) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
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
    const res = await client.get(`/api/services${qs ? `?${qs}` : ""}`);
    return res.data;
  } catch {
    return { data: { services: [] }, success: false };
  }
}

export async function getServiceByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/services/${id}`);
    return res.data?.data?.service || res.data;
  } catch {
    return null;
  }
}

export async function getServiceBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/services/slug/${slug}`);
    return res.data?.data?.service || res.data;
  } catch {
    return null;
  }
}

export async function getFeaturedServicesServer() {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get("/api/services/featured");
    return res.data?.data?.services || res.data;
  } catch {
    return [];
  }
}

export async function createServiceAction(serviceData) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/services", serviceData);
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/services/${id}`, serviceData);
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/services/${id}`);
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
    const client = createServerClient(cookieStore);
    const res = await client.get("/api/services/bookings");
    return res.data?.data?.bookings || res.data;
  } catch {
    return [];
  }
}

export async function getBookingByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/services/bookings/${id}`);
    return res.data?.data?.booking || res.data;
  } catch {
    return null;
  }
}

export async function cancelBookingAction(bookingId, reason) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.patch(`/api/services/bookings/${bookingId}/cancel`, { reason });
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/services/bookings/${bookingId}`, bookingData);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update booking",
    };
  }
}
