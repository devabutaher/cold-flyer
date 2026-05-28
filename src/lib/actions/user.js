"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient, API_BACKEND_URL, getServerFetchHeaders } from "@/lib/http-client";

export async function updateProfileAction(data) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch("/api/users/profile", data);
    revalidateTag("user-profile");
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
    const res = await fetch(`${API_BACKEND_URL}/api/users/addresses`, {
      headers: getServerFetchHeaders(cookieStore),
    });
    const data = await res.json();
    return { success: true, addresses: data?.data?.addresses || [] };
  } catch {
    return { success: false, addresses: [] };
  }
}

export async function addAddressAction(data) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/users/addresses", data);
    revalidateTag("user-profile");
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
    revalidateTag("user-profile");
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
    revalidateTag("user-profile");
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
    revalidateTag("user-profile");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to set default address",
    };
  }
}

export async function sendVerificationCodeAction() {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/auth/send-verification-code");
    return { success: true, message: res.data?.message || "Code sent" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to send code",
    };
  }
}

export async function verifyEmailAction(code) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/auth/verify-email", { code });
    revalidateTag("user-profile");
    return { success: true, message: res.data?.message || "Email verified" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to verify email",
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
