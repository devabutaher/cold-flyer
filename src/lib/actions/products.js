"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient, API_BACKEND_URL, getServerFetchHeaders } from "@/lib/http-client";
import { requireRole } from "@/lib/auth-server";

export async function getProductsServer(params) {
  try {
    const cookieStore = await cookies();
    const query = new URLSearchParams();
    if (params?.q) query.set("search", String(params.q));
    if (params?.category && params.category !== "All Categories") query.set("category", String(params.category));
    if (params?.brand && params.brand !== "All Brands") query.set("brand", String(params.brand));
    if (params?.productType) query.set("productType", String(params.productType));
    if (params?.sort) query.set("sortBy", String(params.sort));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const res = await fetch(`${API_BACKEND_URL}/api/products${qs ? `?${qs}` : ""}`, {
      headers: getServerFetchHeaders(cookieStore),
    });
    const data = await res.json();
    return data;
  } catch {
    return { data: { products: [] } };
  }
}

export async function getProductBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/products/slug/${slug}`, {
      headers: getServerFetchHeaders(cookieStore),
    });
    const data = await res.json();
    return data?.data?.product || data;
  } catch {
    return null;
  }
}

export async function getProductByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${API_BACKEND_URL}/api/products/${id}`, {
      headers: getServerFetchHeaders(cookieStore),
    });
    const data = await res.json();
    return data?.data?.product || data;
  } catch {
    return null;
  }
}

export async function createProductAction(productData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/products", productData);
    revalidateTag("products");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to create product",
      error: error.response?.data,
    };
  }
}

export async function updateProductAction(id, productData) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/products/${id}`, productData);
    revalidateTag("products");
    revalidateTag("product-detail");
    return { success: true, data: res.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update product",
      error: error.response?.data,
    };
  }
}

export async function deleteProductAction(id) {
  try {
    await requireRole("admin", "moderator");
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/products/${id}`);
    revalidateTag("products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete product",
    };
  }
}
