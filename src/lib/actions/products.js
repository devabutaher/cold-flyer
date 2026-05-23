"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/http-client";

export async function getProductsServer(params) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const query = new URLSearchParams();
    if (params?.q) query.set("search", String(params.q));
    if (params?.category && params.category !== "All Categories") query.set("category", String(params.category));
    if (params?.brand && params.brand !== "All Brands") query.set("brand", String(params.brand));
    if (params?.productType) query.set("productType", String(params.productType));
    if (params?.sort) query.set("sortBy", String(params.sort));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const res = await client.get(`/api/products${qs ? `?${qs}` : ""}`);
    return res.data;
  } catch {
    return { data: { products: [] } };
  }
}

export async function getProductBySlugServer(slug) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/products/slug/${slug}`);
    return res.data?.data?.product || res.data;
  } catch {
    return null;
  }
}

export async function getProductByIdServer(id) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.get(`/api/products/${id}`);
    return res.data?.data?.product || res.data;
  } catch {
    return null;
  }
}

export async function createProductAction(productData) {
  try {
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.post("/api/products", productData);
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    const res = await client.patch(`/api/products/${id}`, productData);
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
    const cookieStore = await cookies();
    const client = createServerClient(cookieStore);
    await client.delete(`/api/products/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to delete product",
    };
  }
}


