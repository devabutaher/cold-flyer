/**
 * Server Actions for Order operations
 * These run on the server and can be called from client components using "use server"
 */

"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { Order, OrderItem, ApiResponse } from "@/types";

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
  const token =
    (globalThis as any).__COLD_FLYER_TOKEN || null;

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

// --- Order Actions ---

export async function getOrdersServer(): Promise<Order[]> {
  try {
    const result = await serverFetch("/api/orders", {
      next: { tags: ["orders"] },
    });
    const data = result as { data?: { orders: Order[] } } | Order[];
    if ("data" in data && data.data?.orders) {
      return data.data.orders;
    }
    return data as Order[];
  } catch {
    return [];
  }
}

export async function getOrderByIdServer(
  id: string,
): Promise<Order | null> {
  try {
    const result = await serverFetch(`/api/orders/${id}`, {
      next: { tags: [`order:${id}`] },
    });
    const data = result as { data?: { order: Order } } | Order;
    if ("data" in data && data.data?.order) {
      return data.data.order;
    }
    return data as Order;
  } catch {
    return null;
  }
}

export async function createOrderAction(
  orderData: {
    items: OrderItem[];
    paymentMethod: string;
    isPickup: boolean;
  },
): Promise<ApiResponse<Order>> {
  try {
    const result = await serverFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    revalidateTag("orders");
    return { success: true, data: result as Order };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to create order",
      error: err.data as string,
    };
  }
}

export async function createQuickCheckoutAction(
  orderData: { items: OrderItem[]; paymentMethod: string; isPickup: boolean },
): Promise<ApiResponse<{ checkoutUrl: string }>> {
  try {
    const result = await serverFetch("/api/orders/quick-checkout", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return { success: true, data: (result as any).data };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to create checkout",
      error: err.data as string,
    };
  }
}

export async function cancelOrderAction(
  orderId: string,
  reason: string,
): Promise<ApiResponse<void>> {
  try {
    await serverFetch(`/api/orders/${orderId}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
    revalidateTag("orders");
    revalidateTag(`order:${orderId}`);
    return { success: true };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Failed to cancel order",
    };
  }
}

export async function verifyPaymentAction(
  orderId: string,
  sessionId: string | null,
): Promise<ApiResponse<void>> {
  try {
    await serverFetch(`/api/orders/${orderId}/verify-payment`, {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
    revalidateTag("orders");
    return { success: true };
  } catch (error) {
    const err = error as ServerApiError;
    return {
      success: false,
      message: err.message || "Payment verification failed",
    };
  }
}