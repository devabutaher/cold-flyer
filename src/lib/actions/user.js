"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/http-client";

export async function updateProfileAction(data) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch("/api/users/profile", data);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update profile",
    };
  }
}

export async function getAddressesAction() {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get("/api/users/addresses");
    return { success: true, addresses: res.data?.data?.addresses || [] };
  } catch {
    return { success: false, addresses: [] };
  }
}

export async function addAddressAction(data) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/users/addresses", data);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to add address",
    };
  }
}

export async function updateAddressAction(id, data) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/users/addresses/${id}`, data);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update address",
    };
  }
}

export async function deleteAddressAction(id) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/users/addresses/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete address",
    };
  }
}

export async function setDefaultAddressAction(id) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/users/default-address/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to set default address",
    };
  }
}

export async function changePasswordAction(data) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/auth/change-password", data);
    return { success: true, message: res.data?.message || "Password changed" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to change password",
    };
  }
}
