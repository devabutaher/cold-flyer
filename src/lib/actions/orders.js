/**
 * Server Actions for Order operations
 * These run on the server and can be called from client components
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

export async function getOrdersServer() {
  try {
    const result = await serverFetch("/api/orders");
    if (result?.data?.orders) return result.data.orders;
    return result;
  } catch {
    return [];
  }
}

export async function getOrderByIdServer(id) {
  try {
    const result = await serverFetch(`/api/orders/${id}`);
    if (result?.data?.order) return result.data.order;
    return result;
  } catch {
    return null;
  }
}

export async function createOrderAction(orderData) {
  try {
    const result = await serverFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    revalidateTag("orders");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create order",
      error: error.data,
    };
  }
}

export async function cancelOrderAction(orderId, reason) {
  try {
    await serverFetch(`/api/orders/${orderId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
    revalidateTag("orders");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to cancel order",
    };
  }
}

export async function verifyPaymentAction(orderId, sessionId) {
  try {
    await serverFetch(`/api/orders/${orderId}/verify-payment`, {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
    revalidateTag("orders");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Payment verification failed",
    };
  }
}
