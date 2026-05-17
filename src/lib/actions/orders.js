"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/http-client";

export async function getOrdersServer() {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get("/api/orders");
    return res.data?.data?.orders || res.data;
  } catch {
    return [];
  }
}

export async function getOrderByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/orders/${id}`);
    return res.data?.data?.order || res.data;
  } catch {
    return null;
  }
}

export async function createOrderAction(orderData) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/orders", orderData);
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
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Payment verification failed",
    };
  }
}
