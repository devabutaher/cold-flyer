/**
 * Server Actions for product CRUD operations
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

export async function getProductsServer(params) {
  const query = new URLSearchParams();
  if (params?.q) query.set("search", String(params.q));
  if (params?.category && params.category !== "All Categories") {
    query.set("category", String(params.category));
  }
  if (params?.brand && params.brand !== "All Brands") {
    query.set("brand", String(params.brand));
  }
  if (params?.productType) {
    query.set("productType", String(params.productType));
  }
  if (params?.sort) {
    query.set("sortBy", String(params.sort));
  }
  if (params?.page) {
    query.set("page", String(params.page));
  }
  if (params?.limit) {
    query.set("limit", String(params.limit));
  }

  const endpoint = query.toString()
    ? `/api/products?${query}`
    : "/api/products";

  const result = await serverFetch(endpoint);
  return result;
}

export async function getProductBySlugServer(slug) {
  try {
    const result = await serverFetch(`/api/products/slug/${slug}`);
    if (result?.data?.product) return result.data.product;
    return result;
  } catch {
    return null;
  }
}

export async function getProductByIdServer(id) {
  try {
    const result = await serverFetch(`/api/products/${id}`);
    if (result?.data?.product) return result.data.product;
    return result;
  } catch {
    return null;
  }
}

export async function createProductAction(productData) {
  try {
    const result = await serverFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    revalidateTag("products");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to create product",
      error: error.data,
    };
  }
}

export async function updateProductAction(id, productData) {
  try {
    const result = await serverFetch(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
    revalidateTag("products");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to update product",
      error: error.data,
    };
  }
}

export async function deleteProductAction(id) {
  try {
    await serverFetch(`/api/products/${id}`, { method: "DELETE" });
    revalidateTag("products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to delete product",
    };
  }
}

export async function uploadImageAction(file, fieldName = "image") {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }
    return { success: true, data: { url: data.data?.url } };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to upload image",
    };
  }
}
