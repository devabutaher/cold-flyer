"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient, API_BACKEND_URL, getServerFetchHeaders } from "@/lib/http-client";

export async function getOrdersServer() {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/orders`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["orders"] },
    });
    const data = await res.json();
    return data?.data?.orders || data;
  } catch {
    return [];
  }
}

export async function getOrderByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/orders/${id}`, {
      headers: getServerFetchHeaders(cookieStore),
      next: { tags: ["orders", "order-detail"] },
    });
    const data = await res.json();
    return data?.data?.order || data;
  } catch {
    return null;
  }
}

export async function createOrderAction(orderData) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/orders", orderData);
    revalidateTag("orders");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create order",
      error: error.response?.data,
    };
  }
}

export async function cancelOrderAction(orderId, reason) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.patch(`/api/orders/${orderId}/cancel`, { reason });
    revalidateTag("orders");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to cancel order",
    };
  }
}

export async function verifyPaymentAction(orderId, sessionId) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.post(`/api/orders/${orderId}/verify-payment`, { sessionId });
    revalidateTag("orders");
    revalidateTag("order-detail");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Payment verification failed",
    };
  }
}
